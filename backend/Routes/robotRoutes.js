const express = require("express");
const {
    registerRobot,
    startedCutting,
    currentCutArea,
    broken,
    doneCutting,
    getRobot,
    maintenance,
    getAllPriceLists
    //getBooking
} = require("../Controllers/robotController");

const router = express.Router();

router.post('/registerRobot', registerRobot);
router.post('/startCutting', startedCutting);
router.post('/currentCutArea', currentCutArea);
router.post('/broken', broken);
router.post('/maintenance', maintenance);
router.post('/doneCutting', doneCutting);
router.get('/getRobot', getRobot);
router.get('/getAllPriceLists', getAllPriceLists)

module.exports = router;