const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
 try {
        console.log('Authentication middleware triggered for:', req.path);
        
        // Check if session exists
        if (!req.session) {
            return res.status(401).json({
                message: "Session not available"
            });
        }

        // Extract access token from multiple sources
        let accessToken = null;
        
        // 1. Check Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            accessToken = authHeader.substring(7);
        }
        
        // 2. Check session stored token
        if (!accessToken && req.session.authorization) {
            accessToken = req.session.authorization['accessToken'];
        }
        
        // 3. Check custom header
        if (!accessToken && req.headers['x-access-token']) {
            accessToken = req.headers['x-access-token'];
        }

        // If no token found
        if (!accessToken) {
            return res.status(401).json({
                message: "Authentication failed. Access token not provided."
            });
        }

        // Verify JWT token
        const jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret-key';
        jwt.verify(accessToken, jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: "Authentication failed. Invalid or expired token."
                });
            }

            // Validate token structure
            if (!user.username) {
                return res.status(401).json({
                    message: "Authentication failed. Invalid token structure."
                });
            }

            // Check if session user matches token user
            if (req.session.authorization && 
                req.session.authorization.username !== user.username) {
                return res.status(401).json({
                    message: "Authentication failed. Session mismatch."
                });
            }

            // Update session with current user data
            req.session.authorization = {
                accessToken: accessToken,
                username: user.username
            };

            // Attach user information to request object
            req.user = user;

            console.log(`User ${user.username} authenticated successfully`);
            
            // Continue to next middleware/route
            next();
        });

    } catch (error) {
        console.error('Authentication error:', error.message);
        
        return res.status(500).json({
            message: "Internal server error during authentication"
        });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
