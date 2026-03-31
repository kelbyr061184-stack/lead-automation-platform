const { Worker } = require("bullmq")
const IORedis = require("ioredis")
const logger = require("../core/logger")

const connection = new IORedis({
  maxRetriesPerRequest: null,
})

const worker = new Worker(
  "automation-queue",
  async job => {
    const { lead } = job.data

    logger.info(`⚙️ Processing automation for ${lead.email}`)

    // Aquí irán integraciones reales
    // Email
    // HubSpot
    // Webhooks
    // CRM Sync

    return true
  },
  { connection }
)

worker.on("completed", job => {
  logger.info(`✅ Job completed ${job.id}`)
})

worker.on("failed", (job, err) => {
  logger.error(`❌ Job failed ${job.id}`, err)
})