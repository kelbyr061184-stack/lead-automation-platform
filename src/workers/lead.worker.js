require("dotenv").config()

const { Worker } = require("bullmq")
const IORedis = require("ioredis")

const connectDatabase = require("../database/connection")
const Lead = require("../modules/lead/lead.model")
const runAutomation = require("../modules/automation/automation.engine")

const logger = require("../core/logger")

/* =============================
   START WORKER
============================= */

async function startWorker() {
  try {
    /* =============================
       DATABASE CONNECTION
    ============================= */
    await connectDatabase()
    logger.info("✅ Worker connected to MongoDB")

    /* =============================
       REDIS CONNECTION
    ============================= */
    const connection = new IORedis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT || 6379,
      maxRetriesPerRequest: null,
    })

    connection.on("connect", () => {
      logger.info("✅ Redis connected")
    })

    connection.on("error", err => {
      logger.error("❌ Redis error")
      logger.error(err)
    })

    /* =============================
       WORKER
    ============================= */
    const worker = new Worker(
      "lead-automation",
      async job => {
        try {
          logger.info("🔥 JOB RECEIVED")

          const { leadId } = job.data

          if (!leadId) {
            throw new Error("leadId missing in job data")
          }

          const lead = await Lead.findById(leadId)

          if (!lead) {
            logger.warn("⚠️ Lead not found")
            return
          }

          logger.info(`🚀 Running automation for ${lead.email}`)

          // 🔥 Automation Engine
          await runAutomation("lead.created", lead)
        } catch (error) {
          logger.error("Worker job error")
          logger.error(error)
          throw error // IMPORTANT for BullMQ retries
        }
      },
      { connection }
    )

    /* =============================
       EVENTS
    ============================= */

    worker.on("completed", job => {
      logger.info(`✅ Job completed: ${job.id}`)
    })

    worker.on("failed", (job, err) => {
      logger.error(`❌ Job failed: ${job?.id}`)
      logger.error(err.message)
    })

    worker.on("error", err => {
      logger.error("Worker crashed")
      logger.error(err)
    })

    /* =============================
       GRACEFUL SHUTDOWN
    ============================= */

    const shutdown = async () => {
      logger.info("🛑 Worker shutting down...")
      await worker.close()
      await connection.quit()
      process.exit(0)
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)

    logger.info("🚀 Lead Worker running...")
  } catch (error) {
    logger.error("❌ Worker failed to start")
    logger.error(error)
    process.exit(1)
  }
}

startWorker()