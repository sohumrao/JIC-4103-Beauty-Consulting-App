import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
    }
});

const ResetPasswordSchema = new mongoose.Schema({
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

const Account = mongoose.model('accounts', AccountSchema);
const ResetPassword = mongoose.model('resetpassword', ResetPasswordSchema);

export {Account, ResetPassword};
