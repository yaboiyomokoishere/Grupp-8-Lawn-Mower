const express = require("express");
const authorization = require('../Middleware/authorization');

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
const validateToken = require("../Middleware/validateTokenHandler");

const router = express.Router();

router.post('/registerRobot', validateToken, authorization("Robot", "create"), registerRobot);
router.post('/startCutting', startedCutting);
router.post('/currentCutArea', currentCutArea);
router.post('/broken', broken);
router.post('/maintenance', validateToken, authorization("Robot", "update"), maintenance);
router.post('/doneCutting', doneCutting);
router.get('/getRobot', validateToken, authorization("Robot", "read"), getRobot);
router.get('/getAllPriceLists', getAllPriceLists)

module.exports = router;