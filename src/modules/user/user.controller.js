const User = require("../auth/user.model")

/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
| GET /api/users/me
*/
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      })
    }

    res.json(user)
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
| PATCH /api/users/me
*/
exports.updateMe = async (req, res, next) => {
  try {
    const { name } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password")

    res.json(user)
  } catch (err) {
    next(err)
  }
}