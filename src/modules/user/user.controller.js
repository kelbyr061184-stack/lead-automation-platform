const bcrypt = require("bcryptjs")
const User = require("./user.model")
const { generateToken } = require("../../core/auth/jwt")

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ email })

    if (exists)
      return res.status(400).json({
        error: "User already exists",
      })

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashed,
    })

    const token = generateToken(user)

    res.json({
      user,
      token,
    })
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")

    if (!user)
      return res.status(401).json({
        error: "Invalid credentials",
      })

    const valid = await bcrypt.compare(password, user.password)

    if (!valid)
      return res.status(401).json({
        error: "Invalid credentials",
      })

    const token = generateToken(user)

    res.json({
      user,
      token,
    })
  } catch (err) {
    next(err)
  }
}