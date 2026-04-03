const eventBus = require("../../core/events/event.bus");
const { runAutomations } = require("./automation.service");
const logger = require("../../core/logger");

/*
|--------------------------------------------------------------------------
| SINGLETON PROTECTION (evita inicializar dos veces)
|--------------------------------------------------------------------------
*/
let initialized = false;

function initAutomationListeners() {
  if (initialized) {
    logger.warn("⚠️ Automation listeners already initialized — skipping");
    return;
  }

  // ============================================================
  //  SAFE EVENT HANDLER WRAPPER (mejorado con más detalles)
  // ============================================================
  const safeHandler = (eventName, handler) => {
    return async (...args) => {
      try {
        logger.debug(`⚡ Event received: ${eventName}`); // uso debug para menos ruido
        await handler(...args);
        logger.debug(`✅ Event processed: ${eventName}`);
      } catch (error) {
        logger.error(`🔥 Error processing event: ${eventName}`);
        logger.error(error);
      }
    };
  };

  // ============================================================
  //  LEAD CREATED EVENT (con cleanup previo)
  // ============================================================
  eventBus.removeAllListeners("lead.created");

  eventBus.on(
    "lead.created",
    safeHandler("lead.created", async (lead) => {
      if (!lead) {
        logger.warn("⚠️ lead.created received without payload");
        return;
      }
      await runAutomations("lead.created", lead);
    })
  );

  // ============================================================
  //  Aquí puedes agregar más eventos en el futuro
  //  eventBus.on("lead.updated", safeHandler(...))
  // ============================================================

  initialized = true;
  logger.info("✅ Automation listeners ready (singleton mode)"); // ÚNICO LOG
}

module.exports = {
  initAutomationListeners,
};