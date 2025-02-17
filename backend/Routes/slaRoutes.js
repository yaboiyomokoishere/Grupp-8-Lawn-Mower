const express = require("express");
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

router.post('/createSla', validateToken, validateActiveUser, createSla);
router.put('/updateSla', validateToken, validateActiveUser, updateSla);
router.get('/getAllSla', validateToken, validateActiveUser, getAllSla);
router.get('/getSla', validateToken, validateActiveUser,  getSla);
router.post('/getPrice', validateToken, validateActiveUser, getPrice);
router.post('/cancelSla', validateToken, validateActiveUser, cancelSla);

router.get('/getSlaLog', validateToken, validateActiveUser, getSlaLog);


router.get('/getAlternatives', validateToken, getHeightAndWorkingAreaAlternatives); 
router.get('/getSlaPriceList', validateToken, getSlaPriceList);


module.exports = router;