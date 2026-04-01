const express = require("express");
const controller = require("./auth.controller");

// ⚠️ IMPORTANTE:
// la ruta debe coincidir EXACTAMENTE con la estructura del proyecto
const authMiddleware = require("../../core/middleware/auth.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

// 🔓 Register
router.post("/register", controller.register);

// 🔓 Login
router.post("/login", controller.login);

// 🔐 Current authenticated user
router.get("/me", authMiddleware, controller.me);

module.exports = router;