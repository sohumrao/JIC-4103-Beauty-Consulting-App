import mongoose from "mongoose";

// Defining the schema for users (subject to change)
const HairDetailsSchema = new mongoose.Schema({
        Natural: Boolean,
        Relaxed: Boolean,
        Straight: Boolean,
        Wavy: Boolean,
        Curly: Boolean,
        DeepWave: Boolean,
        LooseCurl: Boolean,
        TightlyCoiled: Boolean,
        Fine: Boolean,
        Medium: Boolean,
        Thick: Boolean,
});


const userSchema = new mongoose.Schema({
    username: String,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: String,
    age: String,
    phoneNumber: String,
    hairDetails: HairDetailsSchema,
    allergies: String,
});

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
    }
});

const resetPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    //TODO: connect tables with IDs
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: "user",
    //   },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60,// seconds
    },
});
// Creating a model based on the user schema
const UserDB = mongoose.model('userdb', userSchema);
const Account = mongoose.model('accounts', accountSchema);
const ResetPassword = mongoose.model('resetpassword', resetPasswordSchema);

export {Account, UserDB, ResetPassword};
