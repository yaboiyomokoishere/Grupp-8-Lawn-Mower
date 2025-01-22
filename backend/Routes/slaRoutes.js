const express = require("express");
const {
    createSla
} = require("../Controllers/slaController");
const validateToken = require("../Middleware/ValidateTokenHandler");


const router = express.Router();

router.post('/createSla', validateToken, createSla);

module.exports = router;