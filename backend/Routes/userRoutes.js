const express = require("express");
const {
    loginUser,
    logoutUser,
    refreshToken,
    registerCustomer,
    registerAdmin
} = require("../Controllers/userController");
const {getCustomerInfo} = require("../Controllers/customerController");
const validateToken = require("../Middleware/ValidateTokenHandler");


const router = express.Router();

// Authentication routes
router.post('/register', registerCustomer);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken); // Refreshes access token with refresh token
//router.post('/admin/register', registerAdmin); // Use this only to create an admin


// Customer routes
router.get('/getCustomer', validateToken, getCustomerInfo); 


// SLA Routes


// Admin routes


module.exports = router;