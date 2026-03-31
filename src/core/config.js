require("dotenv").config()

const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },

  database: {
    mongoUri: process.env.MONGODB_URI,
  },

  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  integrations: {
    hubspotToken: process.env.HUBSPOT_ACCESS_TOKEN,
    resendKey: process.env.RESEND_API_KEY,
    sheetsUrl: process.env.GOOGLE_SHEETS_URL,
  },
}

module.exports = config