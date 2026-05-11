const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginVulnerable);

router.post('/login-script', authController.loginWithScript);

router.post('/login-secure', authController.loginSecure);

router.post('/login-regex', authController.loginBlindRegex);

module.exports = router;