const express = require("express");
const controller = require("./auth.controller");
const authMiddleware = require("../../core/middleware/auth.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

// ✅ Register user
router.post("/register", controller.register);

// ✅ Login user
router.post("/login", controller.login);

// ✅ Get authenticated user (JWT required)
router.get("/me", authMiddleware, controller.me);

module.exports = router;