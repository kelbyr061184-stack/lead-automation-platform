const axios = require("axios")
const logger = require("../../core/logger")

async function sendWebhook(data) {
  try {
    await axios.post(process.env.WEBHOOK_URL, data)

    logger.info("🌐 Webhook sent")
  } catch (error) {
    logger.error("Webhook error")
    logger.error(error.message)
  }
}

module.exports = sendWebhook