const eventBus = require("../../core/events/event.bus")
const { runAutomations } = require("./automation.service")
const logger = require("../../core/logger")

let initialized = false

function initAutomationListeners() {
  // ✅ Evita registrar listeners duplicados
  if (initialized) return

  initialized = true

  logger.info("🎧 Automation listeners initialized")

  /*
  |--------------------------------------------------------------------------
  | LEAD CREATED
  |--------------------------------------------------------------------------
  */

  eventBus.on("lead.created", async (lead) => {
    try {
      logger.info("⚡ lead.created event received")

      // ✅ Validar payload
      if (!lead) {
        logger.warn("No lead received in event")
        return
      }

      // ✅ Ejecutar automations
      await runAutomations("lead.created", lead)

    } catch (error) {
      logger.error("Automation listener error")
      logger.error(error)
    }
  })
}

module.exports = {
  initAutomationListeners,
}