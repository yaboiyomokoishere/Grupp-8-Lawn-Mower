const express = require("express");
const {
    registerRobot,
    startedCutting,
    currentCutArea,
    broken,
    doneCutting,
    getRobot
} = require("../Controllers/robotController");

const router = express.Router();

router.post('/registerRobot', registerRobot);
router.post('/startCutting', startedCutting);
router.post('/currentCutArea', currentCutArea);
router.post('/broken', broken);
router.post('/doneCutting', doneCutting);
router.get('/getRobot', getRobot);

module.exports = router;