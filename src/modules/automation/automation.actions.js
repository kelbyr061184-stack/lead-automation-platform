const sendEmail = require("../../integrations/email/resend")
const sendWebhook = require("../../integrations/webhook/webhook")
const sendToCRM = require("../../integrations/crm/crm")
const logger = require("../../core/logger")

const actions = {
  async sendWelcomeEmail(lead, config) {
    await sendEmail({
      to: lead.email,
      subject: config.subject || "Welcome 🚀",
      html:
        config.html ||
        `<h2>Hola ${lead.name}</h2>
         <p>Gracias por contactarnos.</p>`,
    })

    logger.info(`📧 Email sent to ${lead.email}`)
  },

  async notifyTeam(lead) {
    logger.info(`👥 Team notified about ${lead.email}`)
  },

  async sendWebhook(lead, config) {
    await sendWebhook({
      url: config.url,
      event: "lead.created",
      lead,
    })

    logger.info("🌐 Webhook sent")
  },

  async syncCRM(lead) {
    await sendToCRM(lead)

    logger.info(`🧩 Lead synced to CRM: ${lead.email}`)
  },
}

module.exports = actions