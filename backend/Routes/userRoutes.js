const express = require("express");
const validateToken = require("../Middleware/ValidateTokenHandler");
const validateActiveUser = require("../Middleware/ValidUser");

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

const { createPriceList,
        getUsers,
        getUser,
        toggleUserStatus,
        updateUser
 } = require("../Controllers/adminController");

const router = express.Router();

// Authentication routes
router.post('/register', registerCustomer);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken); // Refreshes access token with refresh token

//router.post('/admin/register', registerAdmin); // Use this only to create an admin


// Customer routes
router.get('/getCustomer', validateToken, validateActiveUser, getCustomerInfo); 
router.put('/updateCustomer', validateToken, validateActiveUser, updateCustomerProfile);


// Admin routes
router.post('/createPriceList', validateToken, createPriceList);
router.get('/getUsers', validateToken, getUsers);
router.get('/getUser', validateToken, getUser);
router.put('/toggleUserStatus', validateToken, toggleUserStatus);
router.put('/updateUser', validateToken, updateUser);
module.exports = router;