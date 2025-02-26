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
    updateCustomerProfile ,
    sendReport,
    getReportCustomer,
    getAllReport,
} = require("../Controllers/customerController");

const { createPriceList,
        getUsers,
        getUser,
        toggleUserStatus,
        updateUser, 
        getUserSlas,
        updateReport
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
router.post('/sendReport', validateToken, validateActiveUser, sendReport);
router.get('/getReportCustomer', validateToken, validateActiveUser, getReportCustomer);

// Admin routes
router.post('/createPriceList', validateToken, createPriceList); // kräver ny resurs i permitio?
router.get('/getUsers', validateToken, authorization("CustomerAccountInfoPrivate", "read"), getUsers);
router.get('/getUser', validateToken, authorization("CustomerAccountInfo", "read"), getUser);
router.put('/toggleUserStatus', validateToken, authorization("CustomerAccountInfoPrivate", "update"), toggleUserStatus);
router.put('/updateUser', validateToken, authorization("CustomerAccountInfoPrivate", "update"), updateUser);
router.get('/getUserSlas', validateToken, authorization("Service_Level_Agreement", "read"), getUserSlas);
router.put('updateReport', validateToken, authorization("", "update"), updateReport);

// technican routes
router.get('/getReportCustomer', validateToken, getReportCustomer);
router.get('/getAllReport', validateToken, getAllReport);
module.exports = router;