// Import required packages and modules
import express from "express";           // Import Express.js framework for building the web server
import mongoose from "mongoose";         // Import Mongoose for MongoDB interactions
import dotenv from 'dotenv';            // Import dotenv for environment variables
import bookRoute from "./routes/bookRoute.js";
import cors from "cors";
// Configure dotenv
dotenv.config();

// Get environment variables
const PORT = process.env.PORT;
const mongoDBURL = process.env.MONGODB_URL;
// Create Express application instance
const app = express();                  // Fix: use express() instead of new express

// Middleware for parsing JSON bodies
app.use(express.json());
// Middleware for custom cors
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}))
// Go to the bookRoute.js file and use the routes from there
app.use('/books',bookRoute);
// Connect to MongoDB and start server  
mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });