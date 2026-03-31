const authService = require("./auth.service")

async function register(req, res, next) {
  try {
    const token = await authService.register(req.body)

    res.json({ token })
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    const token = await authService.login(req.body)

    res.json({ token })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
}