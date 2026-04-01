const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("./user.model")

/*
|--------------------------------------------------------------------------
| CUSTOM ERROR (PRO)
|--------------------------------------------------------------------------
*/

class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined")
}

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

async function register(data) {
  const { email, password, name } = data

  if (!email || !password || !name) {
    throw new AppError("Missing fields", 400)
  }

  const exists = await User.findOne({ email })

  if (exists) {
    throw new AppError("User already exists", 409)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    email,
    name,
    password: hashedPassword,
  })

  return generateToken(user)
}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

async function login(data) {
  const { email, password } = data

  if (!email || !password) {
    throw new AppError("Email and password required", 400)
  }

  const user = await User.findOne({ email })

  // 🔐 MISMO ERROR PARA SEGURIDAD
  if (!user) {
    throw new AppError("Invalid credentials", 401)
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    throw new AppError("Invalid credentials", 401)
  }

  return generateToken(user)
}

/*
|--------------------------------------------------------------------------
| TOKEN
|--------------------------------------------------------------------------
*/

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  )
}

module.exports = {
  register,
  login,
}