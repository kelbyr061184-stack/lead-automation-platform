const mongoose = require("mongoose")

const AutomationRunSchema = new mongoose.Schema(
  {
    automation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Automation",
      required: true,
    },

    lead: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running",
    },

    logs: [
      {
        action: String,
        success: Boolean,
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    error: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("AutomationRun", AutomationRunSchema)