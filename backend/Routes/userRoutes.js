const express = require("express");
const validateToken = require("../Middleware/validateTokenHandler");
const validateActiveUser = require("../Middleware/ValidUser");
const authorization = require('../Middleware/authorization');

const {
    loginUser,
    logoutUser,
    refreshToken,
    registerCustomer,
    registerAdmin
} = require("../Controllers/userController");

const { 
    getCustomerInfo, 
    updateCustomerProfile ,
    sendReport,
    
    getCustomerReports,
    getAllReports,
    updateReportStatus
} = require("../Controllers/customerController");

const { createPriceList,
        getPriceLists,
        getPriceList,
        updatePriceList,
        getUsers,
        getUser,
        toggleUserStatus,
        createUser,
        updateUser, 
        getUserSlas,
        updateSlaStatus,
        updateServiceDetails,
        respondReport
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
router.get('/getReports', validateToken, validateActiveUser, getCustomerReports);

// -----------------------Admin routes------------------------------------------
router.post('/createPriceList', validateToken, createPriceList);
router.get('/getPriceLists',  getPriceLists); 
router.get('/getPriceList', validateToken, getPriceList)
router.put('/updatePriceList', validateToken, updatePriceList)
// Users management
router.get('/getUsers', validateToken, authorization("CustomerAccountInfoPrivate", "read"), getUsers);
router.get('/getUser', validateToken, authorization("CustomerAccountInfo", "read"), getUser);
router.put('/toggleUserStatus', validateToken, authorization("CustomerAccountInfoPrivate", "update"), toggleUserStatus);
router.post('/createUser', validateToken, authorization("CustomerAccountInfoPrivate", 'create'), createUser);
router.put('/updateUser', validateToken, authorization("CustomerAccountInfoPrivate", "update"), updateUser);
// Sla related 
router.get('/getUserSlas', validateToken, authorization("Service_Level_Agreement", "read"), getUserSlas);
router.put('/updateReportStatus', validateToken,  updateReportStatus);
router.put('/respondReport', validateToken, respondReport);

// Technician routes
//router.get('/getReportCustomer', validateToken, getReportCustomer);

router.get('/getAllReports', validateToken, getAllReports);


router.put('/updateSlaStatus', validateToken, authorization("Service_Level_Agreement", "update"), updateSlaStatus);
router.put('/updateServiceDetails', validateToken, authorization("Service_Level_Agreement", "update"), updateServiceDetails);
module.exports = router;