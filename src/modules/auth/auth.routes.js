const express = require("express")
const controller = require("./auth.controller")
const authMiddleware = require("./auth.middleware")

const router = express.Router()

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

// ✅ Register user
router.post("/register", controller.register)

// ✅ Login user
router.post("/login", controller.login)

// ✅ Get current authenticated user (JWT REQUIRED)
router.get("/me", authMiddleware, controller.me)

module.exports = router