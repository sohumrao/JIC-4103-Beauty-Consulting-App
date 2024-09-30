import mongoose from "mongoose";

// Defining the schema for stylists (subject to change)
const StylistDetailsSchema = new mongoose.Schema({
        experience: String,
        specialty: String,
        additionalInfo: String,
        businessName: String,
        businessAddress: String
});


const StylistSchema = new mongoose.Schema({
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
    stylistDetails: StylistDetailsSchema
});

// Creating a model based on the client schema
const Stylist = mongoose.model('Stylist', StylistSchema);


export {Stylist};
