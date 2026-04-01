const authService = require("./auth.service");

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
async function register(req, res, next) {
  try {
    const token = await authService.register(req.body);

    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
async function login(req, res, next) {
  try {
    const token = await authService.login(req.body);

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| GET CURRENT USER (JWT REQUIRED)
|--------------------------------------------------------------------------
*/
async function me(req, res, next) {
  try {
    // req.user viene del auth.middleware
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  me,
};