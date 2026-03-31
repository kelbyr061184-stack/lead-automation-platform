const mongoose = require("mongoose")
const config = require("../core/config")
const logger = require("../core/logger")

async function connectDatabase() {
  try {
    await mongoose.connect(config.database.mongoUri)

    logger.info("✅ MongoDB connected")
  } catch (error) {
    logger.error("❌ MongoDB connection failed")
    logger.error(error)
    process.exit(1)
  }
}

module.exports = connectDatabase