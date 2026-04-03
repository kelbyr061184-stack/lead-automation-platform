require("dotenv").config()

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { v4: uuidv4 } = require("uuid")

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
const authRoutes = require("./modules/auth/auth.routes")
const userRoutes = require("./modules/user/user.routes")
const leadRoutes = require("./modules/lead/lead.routes")
const automationRoutes = require("./modules/automation/automation.routes")

const app = express()

/* ======================================================
   TRUST PROXY (RENDER / CLOUD)
====================================================== */
app.set("trust proxy", 1)

/* ======================================================
   SECURITY
====================================================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
)

/* ======================================================
   CORS FIX (🔥 LOGIN ERROR SOLVED)
====================================================== */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://lead-automation-dashboard-two.vercel.app",
]

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser tools (postman, curl)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      logger.warn(`⛔ Blocked CORS origin: ${origin}`)
      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
  })
)

/* ======================================================
   BODY PARSER
====================================================== */

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

/* ======================================================
   REQUEST ID
====================================================== */

app.use((req, res, next) => {
  req.id = uuidv4()
  res.setHeader("X-Request-Id", req.id)
  next()
})

/* ======================================================
   REQUEST LOGGER
====================================================== */

app.use((req, res, next) => {
  logger.info(`➡️ [${req.id}] ${req.method} ${req.originalUrl}`)
  next()
})

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

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
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
  logger.error(`🔥 [${req.id}] GLOBAL ERROR`)
  logger.error(err)

  const statusCode = err.statusCode || err.status || 500

  res.status(statusCode).json({
    error:
      config.app.env === "production"
        ? statusCode === 500
          ? "Internal Server Error"
          : err.message
        : err.message,
  })
})

/* ======================================================
   SERVER BOOTSTRAP
====================================================== */

async function startServer() {
  try {
    logger.info("🚀 Starting Lead Automation Platform...")

    // DATABASE
    await connectDatabase()
    logger.info("✅ Database connected")

    // AUTOMATIONS
    initAutomationListeners()
    logger.info("🎧 Automation listeners initialized")

    // SERVER
    const server = app.listen(config.app.port, () => {
      logger.info(
        `🌎 Server running at http://localhost:${config.app.port} (${config.app.env})`
      )
    })

    /* ======================
       GRACEFUL SHUTDOWN
    ====================== */

    const shutdown = (signal) => {
      logger.info(`🛑 ${signal} received. Closing server...`)

      server.close(() => {
        logger.info("✅ HTTP server closed")
        process.exit(0)
      })

      setTimeout(() => {
        logger.error("⚠️ Force shutdown")
        process.exit(1)
      }, 10000)
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)

    /* ======================
       CRITICAL ERRORS
    ====================== */

    process.on("uncaughtException", (error) => {
      logger.error("💥 Uncaught Exception")
      logger.error(error)
      shutdown("uncaughtException")
    })

    process.on("unhandledRejection", (reason) => {
      logger.error("💥 Unhandled Rejection")
      logger.error(reason)
      shutdown("unhandledRejection")
    })

  } catch (error) {
    logger.error("❌ Failed to start server")
    logger.error(error)
    process.exit(1)
  }
}

startServer()

module.exports = app