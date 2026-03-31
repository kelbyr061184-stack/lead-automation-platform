const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("./user.model")

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

async function register(data) {
  const { email, password, name } = data

  const exists = await User.findOne({ email })

  if (exists) throw new Error("User already exists")

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

  const user = await User.findOne({ email })

  if (!user) throw new Error("Invalid credentials")

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) throw new Error("Invalid credentials")

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
    { expiresIn: "7d" }
  )
}

module.exports = {
  register,
  login,
}