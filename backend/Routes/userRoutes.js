const express = require("express");
const {
    registerUser,
    loginUser,
    currentUser
} = require("../Controllers/userController");
const validateToken = require("../Middleware/ValidateTokenHandler");

const router = express.Router();

router.route('/register', registerUser);

router.route('/login', loginUser);

router.route('/current', validateToken, currentUser);


module.exports = router;