import mongoose from "mongoose";

// Defining the schema for stylists (subject to change)
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
    hairDetails: HairDetailsSchema,
    allergies: String,
});

// Creating a model based on the client schema
const Stylist = mongoose.model('Stylist', StylistSchema);


export {Stylist};
