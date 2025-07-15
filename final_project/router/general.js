const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   try {
        // Return all books from the database
        if (books && Object.keys(books).length > 0) {
            return res.status(200).json({
                message: "Books retrieved successfully",
                books: books
            });
        } else {
            return res.status(404).json({
                message: "No books found in the shop"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
    
    try {
        // Find book by ISBN
        const book = books[isbn];
        
        if (book) {
            return res.status(200).json({
                message: "Book found",
                isbn: isbn,
                book: book
            });
        } else {
            return res.status(404).json({
                message: "Book not found with the given ISBN",
                isbn: isbn
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book by ISBN",
            error: error.message
        });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   const author = req.params.author;
    
    try {
        let booksByAuthor = [];
        
        // Search through all books to find matches by author
        for (let isbn in books) {
            if (books[isbn].author && 
                books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
                booksByAuthor.push({
                    isbn: isbn,
                    ...books[isbn]
                });
            }
        }
        
        if (booksByAuthor.length > 0) {
            return res.status(200).json({
                message: "Books found by author",
                author: author,
                count: booksByAuthor.length,
                books: booksByAuthor
            });
        } else {
            return res.status(404).json({
                message: "No books found by the given author",
                author: author
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by author",
            error: error.message
        });
    }
 // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title = req.params.title;
    
    try {
        let booksByTitle = [];
        
        // Search through all books to find matches by title
        for (let isbn in books) {
            if (books[isbn].title && 
                books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
                booksByTitle.push({
                    isbn: isbn,
                    ...books[isbn]
                });
            }
        }
        
        if (booksByTitle.length > 0) {
            return res.status(200).json({
                message: "Books found by title",
                title: title,
                count: booksByTitle.length,
                books: booksByTitle
            });
        } else {
            return res.status(404).json({
                message: "No books found with the given title",
                title: title
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by title",
            error: error.message
        });
    }
 // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
