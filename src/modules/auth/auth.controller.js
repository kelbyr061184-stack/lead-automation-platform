const authService = require("./auth.service")

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
async function register(req, res, next) {
  try {
    const token = await authService.register(req.body)

    res.status(201).json({
      message: "User registered successfully",
      token,
    })
  } catch (error) {
    next(error)
  }
}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
async function login(req, res, next) {
  try {
    const token = await authService.login(req.body)

    res.json({
      message: "Login successful",
      token,
    })
  } catch (error) {
    next(error)
  }
}

/*
|--------------------------------------------------------------------------
| GET CURRENT USER (JWT REQUIRED)
|--------------------------------------------------------------------------
*/
async function me(req, res) {
  // req.user viene del auth.middleware
  res.json({
    user: req.user,
  })
}

module.exports = {
  register,
  login,
  me,
}