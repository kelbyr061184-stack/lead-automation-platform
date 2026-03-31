const automationQueue = require("../queues/automation.queue")
const logger = require("../core/logger")

/**
 * Dispara una automation basada en evento
 */
async function triggerAutomation(event, payload) {
  try {
    await automationQueue.add(
      "automation-job",
      {
        event,
        payload,
      },
      {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
      }
    )

    logger.info(`🚀 Automation queued → ${event}`)
  } catch (error) {
    logger.error("Automation trigger error:", error)
  }
}

/**
 * Helper específico para leads
 */
async function runLeadAutomation(lead) {
  await triggerAutomation("lead.created", {
    leadId: lead._id.toString(),
    email: lead.email,
    name: lead.name,
  })
}

module.exports = {
  triggerAutomation,
  runLeadAutomation,
}