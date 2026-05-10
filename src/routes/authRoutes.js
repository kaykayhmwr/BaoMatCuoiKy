const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginVulnerable);


router.post('/login-secure', authController.loginSecure);

module.exports = router;