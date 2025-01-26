const express = require("express");
const validateToken = require("../Middleware/ValidateTokenHandler");

const {
    loginUser,
    logoutUser,
    refreshToken,
    registerCustomer
    //registerAdmin
} = require("../Controllers/userController");

const { 
    getCustomerInfo, 
    updateCustomerProfile 
} = require("../Controllers/customerController");


const router = express.Router();

// Authentication routes
router.post('/register', registerCustomer);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken); // Refreshes access token with refresh token

//router.post('/admin/register', registerAdmin); // Use this only to create an admin


// Customer routes
router.get('/getCustomer', validateToken, getCustomerInfo); 
router.put('/updateCustomer', validateToken, updateCustomerProfile);


// SLA Routes


// Admin routes


module.exports = router;