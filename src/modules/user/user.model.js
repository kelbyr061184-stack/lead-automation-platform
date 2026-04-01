const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

/*
|--------------------------------------------------------------------------
| USER SCHEMA
|--------------------------------------------------------------------------
*/

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // 🔐 nunca enviar password por defecto
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

/*
|--------------------------------------------------------------------------
| PASSWORD HASH (AUTO)
|--------------------------------------------------------------------------
*/

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  next()
})

/*
|--------------------------------------------------------------------------
| PASSWORD COMPARE METHOD
|--------------------------------------------------------------------------
*/

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

/*
|--------------------------------------------------------------------------
| SAFE USER OBJECT (NO PASSWORD)
|--------------------------------------------------------------------------
*/

UserSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

/*
|--------------------------------------------------------------------------
| MODEL EXPORT
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model("User", UserSchema)