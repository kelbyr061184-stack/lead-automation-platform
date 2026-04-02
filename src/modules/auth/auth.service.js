const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("./user.model");

/*
|--------------------------------------------------------------------------
| CUSTOM ERROR (PRO)
|--------------------------------------------------------------------------
*/

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 🔐 Generar JWT_SECRET si no está definido en el entorno
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Solo para desarrollo / emergencia: genera un secreto aleatorio
  // En producción es MUY recomendable definir la variable en Render
  JWT_SECRET = crypto.randomBytes(64).toString("hex");
  console.warn("⚠️  JWT_SECRET no definido en variables de entorno. Se generó uno aleatorio.");
  console.warn("⚠️  Todos los tokens quedarán inválidos al reiniciar el servicio.");
  console.warn("⚠️  Define JWT_SECRET en el panel de Render para evitar este mensaje.");
}

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

async function register(data) {
  const { email, password, name } = data;

  if (!email || !password || !name) {
    throw new AppError("Missing fields", 400);
  }

  const exists = await User.findOne({ email });

  if (exists) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    name,
    password: hashedPassword,
  });

  return generateToken(user);
}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

async function login(data) {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const user = await User.findOne({ email });

  // 🔐 MISMO ERROR PARA SEGURIDAD
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  return generateToken(user);
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
  );
}

module.exports = {
  register,
  login,
};