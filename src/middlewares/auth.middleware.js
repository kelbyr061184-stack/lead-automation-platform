const jwt = require("jsonwebtoken")
const User = require("../modules/auth/user.model")

async function authMiddleware(req, res, next) {
  try {
    /* =============================
       CHECK AUTH HEADER
    ============================= */

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Not authorized, token missing",
      })
    }

    /* =============================
       EXTRACT TOKEN
    ============================= */

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        error: "Token not provided",
      })
    }

    /* =============================
       VERIFY TOKEN
    ============================= */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    /* =============================
       LOAD USER FROM DATABASE
    ============================= */

    const user = await User.findById(decoded.id).select(
      "-password"
    )

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      })
    }

    /* =============================
       ATTACH USER TO REQUEST
    ============================= */

    req.user = user

    next()
  } catch (error) {
    console.error("AUTH ERROR:", error.message)

    return res.status(401).json({
      error: "Invalid or expired token",
    })
  }
}

module.exports = authMiddleware