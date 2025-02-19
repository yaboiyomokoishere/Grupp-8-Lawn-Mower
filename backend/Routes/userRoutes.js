const express = require("express");
const validateToken = require("../Middleware/validateTokenHandler");
const validateActiveUser = require("../Middleware/ValidUser");
const authorization = require('../Middleware/authorization');

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
router.get('/getCustomer', validateToken, validateActiveUser,authorization("CustomerAccountInfo", "read"), getCustomerInfo); 
router.put('/updateCustomer', validateToken, validateActiveUser, authorization("CustomerAccountInfo", "update"), updateCustomerProfile);


// Admin routes
router.post('/createPriceList', validateToken, createPriceList); // kräver ny resurs i permitio?
router.get('/getUsers', validateToken, authorization("CustomerAccountInfoPrivate", "read"), getUsers);
router.get('/getUser', validateToken, authorization("CustomerAccountInfo", "read"), getUser);
router.put('/toggleUserStatus', validateToken, authorization("CustomerAccountInfoPrivate", "update"), toggleUserStatus);
router.put('/updateUser', validateToken, authorization("CustomerAccountInfoPrivate", "update"), updateUser);
module.exports = router;