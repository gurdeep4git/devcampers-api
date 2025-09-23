const express = require("express");
const {
    register,
    login,
    getMe,
    updateDetails,
    updatePassword
} = require("../controllers/auth-controller");
const {protect} = require("../middlewares/auth");

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(protect, getMe)
router.route('/update-details').put(protect, updateDetails)
router.route('/update-password').put(protect, updatePassword)

module.exports = router