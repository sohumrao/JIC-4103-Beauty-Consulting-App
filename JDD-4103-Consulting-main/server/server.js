import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import mongoose from "mongoose";
import connectDB from "./db/connection.js";

const PORT = process.env.PORT || 5050;
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// connect to MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('MongoDB connection is open');
});


// start the Express server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});