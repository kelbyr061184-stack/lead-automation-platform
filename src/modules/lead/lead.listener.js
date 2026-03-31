const eventBus = require("../../core/events/event.bus")
const leadQueue = require("../../queues/lead.queue")
const logger = require("../../core/logger")

// ============================
// LEAD CREATED EVENT
// ============================
eventBus.on("lead.created", async data => {
  try {
    logger.info("📨 Event received: lead.created")

    await leadQueue.add("new-lead", {
      leadId: data.leadId,
    })

    logger.info("✅ Lead job added to queue")
  } catch (error) {
    logger.error(error)
  }
})