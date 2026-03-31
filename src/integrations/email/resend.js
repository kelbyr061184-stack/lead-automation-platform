const { Resend } = require("resend")
const logger = require("../../core/logger")

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendEmail({ to, subject, html }) {
  try {
    await resend.emails.send({
      from: "Automation <onboarding@resend.dev>",
      to,
      subject,
      html,
    })

    logger.info(`📧 Email sent to ${to}`)
  } catch (error) {
    logger.error("Email error")
    logger.error(error)
  }
}

module.exports = sendEmail