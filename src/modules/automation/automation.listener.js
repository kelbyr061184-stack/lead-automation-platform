const eventBus = require("../../core/events/event.bus")
const { runAutomations } = require("./automation.service")
const logger = require("../../core/logger")

/*
|--------------------------------------------------------------------------
| SINGLETON PROTECTION
|--------------------------------------------------------------------------
*/

let initialized = false

function initAutomationListeners() {
  if (initialized) {
    logger.warn("⚠️ Automation listeners already initialized — skipping")
    return
  }

  initialized = true

  logger.info("🎧 Initializing automation listeners...")

  /*
  |--------------------------------------------------------------------------
  | SAFE EVENT HANDLER WRAPPER
  |--------------------------------------------------------------------------
  */

  const safeHandler = (eventName, handler) => {
    return async (...args) => {
      try {
        logger.info(`⚡ Event received: ${eventName}`)

        await handler(...args)

        logger.info(`✅ Event processed: ${eventName}`)
      } catch (error) {
        logger.error(`🔥 Error processing event: ${eventName}`)
        logger.error(error)
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LEAD CREATED EVENT
  |--------------------------------------------------------------------------
  */

  eventBus.removeAllListeners("lead.created") // 🔥 evita duplicados

  eventBus.on(
    "lead.created",
    safeHandler("lead.created", async (lead) => {
      if (!lead) {
        logger.warn("⚠️ lead.created received without payload")
        return
      }

      await runAutomations("lead.created", lead)
    })
  )

  logger.info("🎧 Automation listeners initialized successfully")
}

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = {
  initAutomationListeners,
}