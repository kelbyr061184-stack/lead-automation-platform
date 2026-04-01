const { verifyToken } = require("../auth/jwt")

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization

    if (!header)
      return res.status(401).json({ error: "No token provided" })

    const token = header.replace("Bearer ", "")

    const decoded = verifyToken(token)

    req.user = decoded

    next()
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
    })
  }
}