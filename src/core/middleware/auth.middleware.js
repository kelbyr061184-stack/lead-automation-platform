const { verifyToken } = require("../auth/jwt")

module.exports = function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    // ======================
    // NO HEADER
    // ======================
    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided",
      })
    }

    // ======================
    // FORMAT CHECK
    // ======================
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid authorization format",
      })
    }

    // ======================
    // EXTRACT TOKEN
    // ======================
    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        error: "Token missing",
      })
    }

    // ======================
    // VERIFY TOKEN
    // ======================
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({
        error: "Invalid token",
      })
    }

    // ======================
    // ATTACH USER TO REQUEST
    // ======================
    req.user = decoded

    next()
  } catch (error) {
    console.error("🔒 Auth Middleware Error:", error.message)

    return res.status(401).json({
      error: "Invalid or expired token",
    })
  }
}