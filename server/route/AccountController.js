import express from "express";
import { Client } from "../model/client.js";
import { Stylist } from "../model/stylist.js";
import { Account, ResetPassword } from "../model/account.js";
import crypto from "crypto"
import nodemailer from "nodemailer"

/**
 * This router handles...
 * 
 * 
 * Dependencies:
 *    - Mongoose Models: Client and Photo schemas for database interaction.
 */

const router = express.Router();

router.post("/createAccount", async (req, res) => {

    // Check if username/password are blank or contain spaces. Those are bad!
    if (req.body.username == '' || req.body.password == '') {
        res.status(404).send('Username and password are required fields.')
        return;
    }
    else if (req.body.username.includes(' ') || req.body.password.includes(' ')) {
        res.status(404).send('Username and password cannot contain spaces.')
        return;
    }

    // Check if account with this username exists
    if (await Account.exists({username: { $eq: req.body.username }})) {
        res.status(409).send("That username already exists! Try a different one or sign in to your account.");
        return;
    }

    const newAccount = new Account();

    // Hash the password for the new user before storing in the database
    newAccount.username = req.body.username;
    newAccount.createHashedPassword(req.body.password);
    
    // Save account to database
    const savedAccount = await newAccount.save();
    res.send(newAccount);
})

router.post("/signIn", async (req, res) => {
    var account =  await Account.findOne({username: { $eq: req.body.username }})
    // Send response if account doesn't exist
    if (account == null) {
        res.status(409).send('Account with that username does not exist.');
        return;
    } else {
        // Check password from request against hashed password in database
        if (account.validateHashedPassword(req.body.password)) {
            res.status(200).send('Signed in successfully!');
        } else {
            res.status(400).send('Wrong password for that username. Try again.');
            return;
        }
    }
})

router.post("/emailResetPasswordLink", async (req, res) => {
    console.log(req.body);
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    const user = await UserDB.findOne({email})
    if (!user) {
        return res.status(404).send('No user with the provided email.')
    }

    //TODO: what to do when user is inactive?
    //TODO: handle case when there already is a token

    //create token
    let resetToken = crypto.randomBytes(20).toString('hex');
    resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //add to database
    const newReset = new ResetPassword({
        email: user.email,
        token: resetToken,
    });

    // Save user in the database
    await newReset.save();
    //TODO: handle database failure

    //TODO: handle case when email fails
    // Create reset URL
    const resetUrl = resetToken; //TODO: deep linking

    //TODO: create a centralized place for dev/production environment logic
    // service: 'gmail',
    // auth: {
    //     user: process.env.EMAIL_ADDRESS,
    //     pass: process.env.EMAIL_PASSWORD
    // }
    //TODO: add local testing smtp server to npm start
    const email_credentials = {
        port: 1025
    }

    const transporter = nodemailer.createTransport(email_credentials);

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_ADDRESS,
        subject: 'Password Reset Request',
        text: `You are receiving this because you have requested a password reset. Please click on the following link, or paste it into your browser to complete the process: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ message: 'Email could not be sent' });
        }
        res.status(200).json({ message: 'Password reset email sent' });
    });
})

export default router;