const express = require("express");
const {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    updatePassword
} = require("../controllers/auth-controller");
const {protect} = require("../middlewares/auth");

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/me').get(protect, getMe)
router.route('/update-details').put(protect, updateDetails)
router.route('/update-password').put(protect, updatePassword)

module.exports = router;