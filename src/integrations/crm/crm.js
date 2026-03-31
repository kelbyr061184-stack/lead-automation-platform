const logger = require("../../core/logger")

async function sendToCRM(lead) {
  // Simulación CRM
  logger.info(`📊 Lead synced to CRM: ${lead.email}`)
}

module.exports = sendToCRM