const Lead = require("./lead.model")
const logger = require("../../core/logger")
const eventBus = require("../../core/events/event.bus")

/* ============================
   CREATE LEAD
============================ */
async function createLead(req, res) {
  try {
    const { email, name } = req.body

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      })
    }

    const lead = await Lead.create({
      email,
      name,
    })

    logger.info(`✅ New lead created: ${lead.email}`)

    // ✅ Emitimos el LEAD COMPLETO
    eventBus.emit("lead.created", lead)

    res.status(201).json(lead)
  } catch (error) {
    logger.error(error)

    res.status(500).json({
      message: "Error creating lead",
    })
  }
}

/* ============================
   GET ALL LEADS
============================ */
async function getLeads(req, res) {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 })

    res.json({
      data: leads,
    })
  } catch (error) {
    logger.error(error)

    res.status(500).json({
      message: "Error fetching leads",
    })
  }
}

/* ============================
   GET LEAD BY ID
============================ */
async function getLeadById(req, res) {
  try {
    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      })
    }

    res.json(lead)
  } catch (error) {
    logger.error(error)

    res.status(500).json({
      message: "Error fetching lead",
    })
  }
}

/* ============================
   UPDATE LEAD
============================ */
async function updateLead(req, res) {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      })
    }

    logger.info(`✏️ Lead updated: ${lead.email}`)

    eventBus.emit("lead.updated", lead)

    res.json(lead)
  } catch (error) {
    logger.error(error)

    res.status(500).json({
      message: "Error updating lead",
    })
  }
}

/* ============================
   DELETE LEAD
============================ */
async function deleteLead(req, res) {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      })
    }

    logger.info(`🗑️ Lead deleted: ${lead.email}`)

    eventBus.emit("lead.deleted", lead)

    res.json({
      message: "Lead deleted successfully",
    })
  } catch (error) {
    logger.error(error)

    res.status(500).json({
      message: "Error deleting lead",
    })
  }
}

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
}