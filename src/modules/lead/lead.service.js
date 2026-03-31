const Lead = require("./lead.model")
const logger = require("../../core/logger")
const runLeadAutomation = require("../../services/automation.service")

/*
|--------------------------------------------------------------------------
| CREATE LEAD SERVICE
|--------------------------------------------------------------------------
*/
async function createLeadService(data) {
  const lead = await Lead.create(data)

  logger.info(`✅ Lead stored: ${lead.email}`)

  // trigger automation queue
  await runLeadAutomation(lead)

  return lead
}

/*
|--------------------------------------------------------------------------
| GET LEADS SERVICE
|--------------------------------------------------------------------------
*/
async function getLeadsService() {
  return Lead.find().sort({ createdAt: -1 })
}

module.exports = {
  createLeadService,
  getLeadsService,
}