const express = require('express');
const axios = require('axios'); // For HTTP requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
    // Method 1: Using Promise callbacks for getting book list
    const getBookListWithPromises = () => {
        return new Promise((resolve, reject) => {
            try {
                // Simulate async operation (in real scenario, this could be a database call)
                setTimeout(() => {
                    if (books && Object.keys(books).length > 0) {
                        resolve({
                            success: true,
                            message: "Books retrieved successfully using Promise callbacks",
                            books: books,
                            totalBooks: Object.keys(books).length,
                            method: "Promise callbacks"
                        });
                    } else {
                        reject(new Error("No books found in the shop"));
                    }
                }, 100); // Simulate network delay
            } catch (error) {
                reject(error);
            }
        });
    };

    // Execute using Promise callbacks with .then() and .catch()
    getBookListWithPromises()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({
                message: "Error retrieving books with Promise callbacks",
                error: error.message,
                method: "Promise callbacks"
            });
        });
});

// Alternative endpoint using async-await for comparison
public_users.get('/async', async function (req, res) {
    try {
        // Method 2: Using async-await for getting book list
        const bookList = await getBookListAsync();
        
        return res.status(200).json({
            message: "Books retrieved successfully using async-await",
            books: bookList.books,
            totalBooks: bookList.totalBooks,
            method: "async-await"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books with async-await",
            error: error.message,
            method: "async-await"
        });
    }
});

// Helper function for async-await pattern
async function getBookListAsync() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                if (books && Object.keys(books).length > 0) {
                    resolve({
                        books: books,
                        totalBooks: Object.keys(books).length
                    });
                } else {
                    reject(new Error("No books found in the database"));
                }
            } catch (error) {
                reject(error);
            }
        }, 150); // Simulate async operation
    });
}

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Using Promise callbacks for ISBN lookup
    const getBookByISBNWithPromise = (isbn) => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    const book = books[isbn];
                    if (book) {
                        resolve({
                            message: "Book found using Promise callbacks",
                            isbn: isbn,
                            book: book,
                            method: "Promise callbacks"
                        });
                    } else {
                        reject(new Error("Book not found with the given ISBN"));
                    }
                }, 75); // Simulate async operation
            } catch (error) {
                reject(error);
            }
        });
    };

    // Execute using Promise callbacks
    getBookByISBNWithPromise(isbn)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({
                message: "Error retrieving book by ISBN with Promise callbacks",
                isbn: isbn,
                error: error.message,
                method: "Promise callbacks"
            });
        });
});

// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    // Using Promise callbacks for author search
    const getBooksByAuthorWithPromise = (author) => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
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
                        resolve({
                            message: "Books found by author using Promise callbacks",
                            author: author,
                            count: booksByAuthor.length,
                            books: booksByAuthor,
                            method: "Promise callbacks"
                        });
                    } else {
                        reject(new Error("No books found by the given author"));
                    }
                }, 120); // Simulate async operation
            } catch (error) {
                reject(error);
            }
        });
    };

    // Execute using Promise callbacks
    getBooksByAuthorWithPromise(author)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({
                message: "Error retrieving books by author with Promise callbacks",
                author: author,
                error: error.message,
                method: "Promise callbacks"
            });
        });
});

// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    // Using Promise callbacks for title search
    const getBooksByTitleWithPromise = (title) => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
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
                        resolve({
                            message: "Books found by title using Promise callbacks",
                            title: title,
                            count: booksByTitle.length,
                            books: booksByTitle,
                            method: "Promise callbacks"
                        });
                    } else {
                        reject(new Error("No books found with the given title"));
                    }
                }, 110); // Simulate async operation
            } catch (error) {
                reject(error);
            }
        });
    };

    // Execute using Promise callbacks
    getBooksByTitleWithPromise(title)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({
                message: "Error retrieving books by title with Promise callbacks",
                title: title,
                error: error.message,
                method: "Promise callbacks"
            });
        });
});

// Get book reviews based on ISBN using Promise callbacks
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Using Promise callbacks for reviews lookup
    const getBookReviewsWithPromise = (isbn) => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    const book = books[isbn];
                    
                    if (book) {
                        resolve({
                            message: "Book reviews retrieved using Promise callbacks",
                            isbn: isbn,
                            title: book.title,
                            reviews: book.reviews || {},
                            reviewCount: Object.keys(book.reviews || {}).length,
                            method: "Promise callbacks"
                        });
                    } else {
                        reject(new Error("Book not found"));
                    }
                }, 80); // Simulate async operation
            } catch (error) {
                reject(error);
            }
        });
    };

    // Execute using Promise callbacks
    getBookReviewsWithPromise(isbn)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(404).json({
                message: "Error retrieving book reviews with Promise callbacks",
                isbn: isbn,
                error: error.message,
                method: "Promise callbacks"
            });
        });
});


// User registration endpoint with Promise callbacks
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    
    // Using Promise callbacks for user registration
    const registerUserWithPromise = (username, password) => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    // Check if username and password are provided
                    if (!username || !password) {
                        reject(new Error("Username and password are required"));
                        return;
                    }
                    
                    // Check if username already exists
                    if (users.find(user => user.username === username)) {
                        reject(new Error("Username already exists"));
                        return;
                    }
                    
                    // Validate username format
                    if (!isValid(username)) {
                        reject(new Error("Invalid username format"));
                        return;
                    }
                    
                    // Add new user
                    users.push({
                        username: username,
                        password: password
                    });
                    
                    resolve({
                        message: "User registered successfully using Promise callbacks",
                        username: username,
                        method: "Promise callbacks"
                    });
                }, 50);
            } catch (error) {
                reject(error);
            }
        });
    };

    // Execute using Promise callbacks
    registerUserWithPromise(username, password)
        .then((result) => {
            return res.status(201).json(result);
        })
        .catch((error) => {
            let statusCode = 400;
            if (error.message === "Username already exists") {
                statusCode = 409;
            }
            return res.status(statusCode).json({
                message: error.message,
                method: "Promise callbacks"
            });
        });
});

module.exports.general = public_users;
