const express = require("express");
const {
    createSla,
    updateSla,
    getPrice,
    getAllSla,
    getSla,
    getHeightAndWorkingAreaAlternatives,
    updateSlaLog
} = require("../Controllers/slaController");
const validateToken = require("../Middleware/ValidateTokenHandler");


const router = express.Router();

router.post('/createSla', validateToken, createSla);
router.put('/updateSla', validateToken, updateSla);
router.get('/getAllSla', validateToken, getAllSla);
router.get('/getSla', validateToken, getSla);
router.post('/getPrice', validateToken, getPrice);

router.get('/getAlternatives', validateToken, getHeightAndWorkingAreaAlternatives); 

>>>>>>> d7dfc16bd459275afff8eec27e008f6813cc2f94

module.exports = router;