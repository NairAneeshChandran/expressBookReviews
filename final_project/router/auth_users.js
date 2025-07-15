const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "aneesh",
        password: "aneesh"
    },
    {
        username: "admin",
        password: "admin123"
    }
];

const isValid = (username) => {
    // Check if username is valid (alphanumeric, minimum 3 characters)
    if (!username || username.length < 3) {
        return false;
    }
    
    // Check if username contains only alphanumeric characters
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
};

const authenticatedUser = (username, password) => {
    // Check if user exists and password matches
    const user = users.find(user => user.username === username);
    return user && user.password === password;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }
    // Validate user credentials
    if (authenticatedUser(username, password)) {
        // Create JWT token
        const accessToken = jwt.sign(
            { 
                username: username,
                role: 'customer'
            },
            process.env.JWT_SECRET || '1234',
            { expiresIn: '1h' }
        );

        // Store in session
        req.session.authorization = {
            accessToken: accessToken,
            username: username
        };

        return res.status(200).json({
            message: "Customer successfully logged in",
            token: accessToken
        });
    } else {
        return res.status(208).json({
            message: "Invalid Login. Check username and password"
        });
    }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({
            message: "Review content is required"
        });
    }

    if (books[isbn]) {
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        books[isbn].reviews[username] = review;
        
        return res.status(200).json({
            message: "Review added/updated successfully",
            isbn: isbn,
            review: review
        });
    } else {
        return res.status(404).json({
            message: "Book not found"
        });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
