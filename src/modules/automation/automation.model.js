const mongoose = require("mongoose")

const AutomationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    event: {
      type: String,
      required: true,
      // ejemplo: lead.created
    },

    active: {
      type: Boolean,
      default: true,
    },

    actions: [
      {
        type: {
          type: String,
          required: true,
          // email | crm | webhook
        },

        config: {
          type: Object,
          default: {},
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Automation", AutomationSchema)