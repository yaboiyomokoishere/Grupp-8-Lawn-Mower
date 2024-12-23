const express = require("express");
const {
    registerUser,
    loginUser,
    currentUser, // remove?
    logoutUser,
    refreshToken
} = require("../Controllers/userController");
const {getCustomerInfo} = require("../Controllers/customerController");
const validateToken = require("../Middleware/ValidateTokenHandler");


const router = express.Router();



// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken); // Refreshes access token with refresh token
//router.post('/current', validateToken, currentUser); 

// Customer routes
router.get('/getCustomer', validateToken, getCustomerInfo); 


// SLA Routes


// Admin routes


module.exports = router;