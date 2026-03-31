require("dotenv").config()

const express = require("express")
const cors = require("cors")

// ======================
// CORE
// ======================
const config = require("./core/config")
const logger = require("./core/logger")

// ======================
// DATABASE
// ======================
const connectDatabase = require("./database/connection")

// ======================
// EVENT LISTENERS
// ======================
const {
  initAutomationListeners,
} = require("./modules/automation/automation.listener")

// ======================
// ROUTES
// ======================
const leadRoutes = require("./modules/lead/lead.routes")
const automationRoutes = require("./modules/automation/automation.routes")

const app = express()

/* ======================================================
   GLOBAL MIDDLEWARES
====================================================== */

app.use(
  cors({
    origin: "*",
  })
)

app.use(express.json())

/* ======================================================
   HEALTH CHECK
====================================================== */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "lead-automation-platform",
    env: config.app.env,
    uptime: process.uptime(),
    timestamp: new Date(),
  })
})

app.get("/", (req, res) => {
  res.send("🚀 Lead Automation Platform Running")
})

/* ======================================================
   API ROUTES
====================================================== */

app.use("/api/leads", leadRoutes)
app.use("/api/automations", automationRoutes)

/* ======================================================
   404 HANDLER
====================================================== */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  })
})

/* ======================================================
   GLOBAL ERROR HANDLER
====================================================== */

app.use((err, req, res, next) => {
  logger.error("🔥 GLOBAL ERROR")
  logger.error(err)

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  })
})

/* ======================================================
   SERVER BOOTSTRAP
====================================================== */

async function startServer() {
  try {
    logger.info("🚀 Starting Lead Automation Platform...")

    // ✅ 1. CONNECT DATABASE FIRST
    await connectDatabase()
    logger.info("✅ Database connected")

    // ✅ 2. INIT EVENT LISTENERS (ONLY ONCE)
    initAutomationListeners()

    // ✅ 3. START HTTP SERVER
    const server = app.listen(config.app.port, () => {
      logger.info(
        `🌎 Server running at http://localhost:${config.app.port} (${config.app.env})`
      )
    })

    /* ======================================================
       GRACEFUL SHUTDOWN
    ====================================================== */

    const shutdown = async (signal) => {
      logger.info(`🛑 ${signal} received. Closing server...`)

      server.close(() => {
        logger.info("✅ HTTP server closed")
        process.exit(0)
      })
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)

    /* ======================================================
       UNCAUGHT ERRORS (VERY IMPORTANT)
    ====================================================== */

    process.on("uncaughtException", (error) => {
      logger.error("💥 Uncaught Exception")
      logger.error(error)
      process.exit(1)
    })

    process.on("unhandledRejection", (reason) => {
      logger.error("💥 Unhandled Rejection")
      logger.error(reason)
      process.exit(1)
    })

  } catch (error) {
    logger.error("❌ Failed to start server")
    logger.error(error)
    process.exit(1)
  }
}

startServer()

module.exports = app