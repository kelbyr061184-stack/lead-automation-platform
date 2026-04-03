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
   TRUST PROXY (RENDER SAFE)
====================================================== */
app.set("trust proxy", true)

/* ======================================================
   SECURITY
====================================================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
)

/* ======================================================
   CORS (FIX LOGIN + RAILWAY + VERCEL + RENDER)
====================================================== */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://lead-automation-dashboard-two.vercel.app",
  "https://lead-automation-dashboard-production.up.railway.app", // ← DOMINIO DE RAILWAY AGREGADO
]

app.use(
  cors({
    origin(origin, callback) {
      // Permitir solicitudes sin origen (como Postman, curl)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      logger.warn(`⛔ Blocked CORS: ${origin}`)
      return callback(null, false) // Rechaza otros orígenes
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
  logger.info(`[${req.id}] ${req.method} ${req.originalUrl}`)
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
   API ROOT (🔥 DEBUG ENDPOINT)
====================================================== */

app.get("/api", (req, res) => {
  res.json({
    message: "API ONLINE",
    routes: [
      "/api/auth",
      "/api/users",
      "/api/leads",
      "/api/automations",
    ],
  })
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
    path: req.originalUrl,
  })
})

/* ======================================================
   GLOBAL ERROR HANDLER
====================================================== */

app.use((err, req, res, next) => {
  logger.error(`🔥 GLOBAL ERROR [${req.id}]`)
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

    await connectDatabase()
    logger.info("✅ Database connected")

    initAutomationListeners()
    logger.info("🎧 Automation listeners initialized")

    const PORT = process.env.PORT || config.app.port || 5000

    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`🌎 Server running on port ${PORT}`)
    })

    /* ======================
       GRACEFUL SHUTDOWN
    ====================== */

    const shutdown = (signal) => {
      logger.info(`🛑 ${signal} received`)

      server.close(() => {
        logger.info("✅ Server closed")
        process.exit(0)
      })

      setTimeout(() => process.exit(1), 10000)
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)

    process.on("uncaughtException", (error) => {
      logger.error("💥 Uncaught Exception", error)
      shutdown("uncaughtException")
    })

    process.on("unhandledRejection", (reason) => {
      logger.error("💥 Unhandled Rejection", reason)
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