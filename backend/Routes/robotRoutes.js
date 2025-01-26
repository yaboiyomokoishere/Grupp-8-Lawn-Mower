const express = require("express");
const {
    createRobot,
    currentCutArea,
    broken,
    done,
    start
} = require("../Controllers/robotController");

const router = express.Router();

router.post('/createRobot', createRobot);
router.post('/currentCutArea', currentCutArea);
router.post('/broken', broken);
router.post('/done', done);
router.post('/start', start);

module.exports = router;