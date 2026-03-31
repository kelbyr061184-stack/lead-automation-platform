const { Queue } = require("bullmq")
const IORedis = require("ioredis")

// ============================
// REDIS CONNECTION
// ============================
const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
})

// ============================
// AUTOMATION QUEUE
// ============================
const automationQueue = new Queue("automation-queue", {
  connection,
})

module.exports = automationQueue