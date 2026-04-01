const express = require("express")
const router = express.Router()

const auth = require("../../middlewares/auth.middleware")

const {
  getMe,
  updateMe,
} = require("./user.controller")

/*
|--------------------------------------------------------------------------
| USER ROUTES (PROTECTED)
|--------------------------------------------------------------------------
*/

// GET current user
router.get("/me", auth, getMe)

// UPDATE profile
router.patch("/me", auth, updateMe)

module.exports = router