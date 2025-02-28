const express = require("express");
const authorization = require('../Middleware/authorization');

const {
    createSla,
    updateSla,
    getPrice,
    getAllSla,
    getSla,
    getHeightAndWorkingAreaAlternatives,
    cancelSla,
    getSlaLog,
    getSlaPriceList
} = require("../Controllers/slaController");
const validateToken = require("../Middleware/validateTokenHandler");
const validateActiveUser = require("../Middleware/ValidUser");


const router = express.Router();

router.post('/createSla', validateToken, validateActiveUser, authorization("Service_Level_Agreement", "create"), createSla);
router.put('/updateSla', validateToken, validateActiveUser, authorization("Service_Level_Agreement", "update"), updateSla);
router.get('/getAllSla', validateToken, validateActiveUser, authorization("Service_Level_Agreement", "read"), getAllSla);
router.get('/getSla', validateToken, validateActiveUser, authorization("Service_Level_Agreement", "read"), getSla);
router.post('/getPrice', validateToken, validateActiveUser, getPrice);
router.post('/cancelSla', validateToken, validateActiveUser, authorization("Service_Level_Agreement", "update"), cancelSla);

router.get('/getSlaLog', validateToken, validateActiveUser, authorization("Service_Level_Agreement", "read"), getSlaLog);
 
router.get('/getSlaPriceList', validateToken, getSlaPriceList);


module.exports = router;