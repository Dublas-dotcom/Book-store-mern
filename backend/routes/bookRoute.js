import Book from "../models/bookModel.js";  // This is our book storage helper
import mongoose from "mongoose";            // This helps us talk to our database
import express from "express";


const router = express.Router();

// 🌟 Function to add a new book to our library 🌟
router.post('/',async (request, response) => {
   try {
       // First, let's check if we have all the information we need about the book
       // Like when filling out a form - all boxes must be checked!
       if(!request.body.title || !request.body.author || !request.body.publishedYear) {
           return response.status(400).send({
               message: "Oops! You forgot to tell me the title, author, or year!"
           });
       }

       // Let's check if we already have this book
       // Like making sure we don't buy the same book twice!
       const existingBook = await Book.findOne({
           title: request.body.title,
           author: request.body.author
       });

       if(existingBook) {
           return response.status(400).send({
               message: "We already have this book in our library!"
           });
       }

       // Create a new book package with all the information
       // Like wrapping up a present with all the details
       const newBook = {
           title: request.body.title,
           author: request.body.author,
           publishedYear: request.body.publishedYear,
       }

       // Save the book in our library and tell everyone it worked!
       const book = await Book.create(newBook);
       return response.status(201).send(book);

   } catch (error) {
       // If something goes wrong, tell us what happened
       console.log(error.message);
       return response.status(500).send({message: error.message});
   }
})

// 📚 Function to get ALL books from our library 📚

router.get('/', async (request, response) => {
   try {
       // Get all books from our shelf
       const books = await Book.find();
       
       // If our library is empty, let people know
       if (!books || books.length === 0) {
           return response.status(404).json({
               message: "Our library is empty right now!"
           });
       }
       
       // Return all our books and tell how many we have
       return response.status(200).json({
           count: books.length,  // Like counting books on a shelf
            books
       });
       
   } catch (error) {
       // If something goes wrong while getting books
       console.log(error.message);
       return response.status(500).json({
           message: "Oops! Had trouble getting the books",
           error: error.message
       });
   }
});

// 🔍 Function to find one specific book by its special ID 🔍
router.get('/:id', async (request, response) => {
   try {
       // Make sure the book ID looks right
       // Like checking if a library card number is real
       if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
           return response.status(400).json({
               message: "That's not a real book ID!"
           });
       }
     
       // Try to find the book
       const existingBook = await Book.findById(request.params.id);

       // If we can't find the book, let them know
       if (!existingBook) {
           return response.status(404).json({
               message: "We couldn't find that book!"
           });
       }
       
       // If we found it, show them the book!
       return response.status(200).json({
           message: "Found your book!",
            existingBook
       });

   } catch (error) {
       // If something goes wrong while searching
       console.log('Error finding book:', error.message);
       return response.status(500).json({
           message: "Oops! Had trouble finding that book",
           error: error.message
       });
   }
});

// ✏️ Function to update a book's information ✏️
router.put('/:id', async (request, response) => {
   try {
       // Make sure they gave us all the new information
       if (!request.body.title || !request.body.author || !request.body.publishedYear) {
           return res.status(400).json({
               message: "Please give all the new book details!"
           });
       }

       const { id } = req.params;

       // Make sure we don't already have another book like this
       const existingBook = await Book.findOne({
           _id: { $ne: id },  // Don't check the book we're updating
           title: req.body.title,
           author: req.body.author
       });

       if (existingBook) {
           return res.status(400).json({
               message: "We already have another book like this!"
           });
       }

       // Update the book information
       const result = await Book.findByIdAndUpdate(id, req.body, { new: true });
       
       if (!result) {
           return res.status(404).json({ message: 'Cannot find that book to update' });
       }

       return res.status(200).json(result);

   } catch (error) {
       return res.status(500).json({ message: error.message });
   }
});

// 🗑️ Function to remove a book from our library 🗑️
router.delete('/:id', async (request, response) => {
   try {
       const { id } = request.params;
       // Try to find and remove the book
       const result = await Book.findByIdAndDelete(id);
       
       if (!result) {
           return response.status(404).json({ message: "Cannot find that book to remove" });
       }
       
       return response.status(200).json({ message: "Book has been removed from library" });
   } catch (error) {
       console.log(error.message);
       return response.status(500).json({ message: error.message });
   }
});

// Share all our library helper functions with other parts of our program
export default router;