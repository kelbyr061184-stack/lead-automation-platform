const Automation = require("./automation.model")
const logger = require("../../core/logger")
const axios = require("axios")

/*
|--------------------------------------------------------------------------
| RUN AUTOMATIONS
|--------------------------------------------------------------------------
*/

async function runAutomations(event, payload) {
  try {
    logger.info(`⚡ Automation event: ${event}`)

    // Buscar automations activas
    const automations = await Automation.find({
      event,
      active: true,
    })

    if (!automations.length) {
      logger.info("No automations found")
      return
    }

    for (const automation of automations) {
      logger.info(`🚀 Running automation: ${automation.name}`)

      if (!automation.actions?.length) {
        logger.warn(`Automation ${automation.name} has no actions`)
        continue
      }

      for (const action of automation.actions) {
        await executeAction(action, payload)
      }
    }

    logger.info(`✅ Automation completed for ${event}`)

  } catch (error) {
    logger.error("Automation execution error")
    logger.error(error)
  }
}

/*
|--------------------------------------------------------------------------
| EXECUTE ACTION
|--------------------------------------------------------------------------
*/

async function executeAction(action, payload) {
  try {
    if (!action) return

    const type = action.type?.toLowerCase()

    switch (type) {

      /*
      |--------------------------------------------------------------------------
      | WEBHOOK ACTION ✅
      |--------------------------------------------------------------------------
      */
      case "webhook":
      case "send_webhook":

        if (!action.config?.url) {
          logger.warn("Webhook action missing URL")
          return
        }

        logger.info(`🌐 Sending webhook to ${action.config.url}`)

        await axios.post(action.config.url, {
          event: "lead.created",
          data: payload,
        })

        logger.info("✅ Webhook sent successfully")
        break


      /*
      |--------------------------------------------------------------------------
      | EMAIL ACTION
      |--------------------------------------------------------------------------
      */
      case "email":
      case "send_email":
        logger.info(`📧 Sending email to ${payload.email}`)
        break


      /*
      |--------------------------------------------------------------------------
      | CRM ACTION
      |--------------------------------------------------------------------------
      */
      case "crm":
      case "send_to_crm":
        logger.info(`📦 Sending lead to CRM: ${payload.email}`)
        break


      /*
      |--------------------------------------------------------------------------
      | NOTIFICATION ACTION
      |--------------------------------------------------------------------------
      */
      case "notify":
      case "notification":
        logger.info(`🔔 Notifying team about ${payload.email}`)
        break


      /*
      |--------------------------------------------------------------------------
      | UNKNOWN ACTION
      |--------------------------------------------------------------------------
      */
      default:
        logger.warn(`❌ Unknown action type: ${action.type}`)
    }

  } catch (error) {
    logger.error("Action execution failed")
    logger.error(error.response?.data || error.message)
  }
}

module.exports = {
  runAutomations,
}