const express = require("express");
const {
    createSla,
    updateSla,
    getPrice,
    getAllSla,
    getSla,
    getHeightAndWorkingAreaAlternatives,
    updateSlaLog,
    cancelSla
} = require("../Controllers/slaController");
const validateToken = require("../Middleware/ValidateTokenHandler");


const router = express.Router();

router.post('/createSla', validateToken, createSla);
router.put('/updateSla', validateToken, updateSla);
router.get('/getAllSla', validateToken, getAllSla);
router.get('/getSla', validateToken, getSla);
router.post('/getPrice', validateToken, getPrice);
router.post('/cancelSla', validateToken, cancelSla);

router.get('/getAlternatives', validateToken, getHeightAndWorkingAreaAlternatives); 
router.post('/updateSlaLog', validateToken, updateSlaLog);
router.get('/getSlaLog', validateToken, getSla);


module.exports = router;