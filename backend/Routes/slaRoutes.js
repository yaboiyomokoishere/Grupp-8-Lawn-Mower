const express = require("express");
const {
    createSla,
    updateSla,
    getPrice,
    getHeightAndWorkingAreaAlternatives
} = require("../Controllers/slaController");
const validateToken = require("../Middleware/ValidateTokenHandler");


const router = express.Router();

router.post('/createSla', validateToken, createSla);
router.put('/updateSla', validateToken, updateSla);
router.get('/getPrice', validateToken, getPrice);
router.get('/getAlternatives', validateToken, getHeightAndWorkingAreaAlternatives); //need validateToken too


module.exports = router;