const express = require("express")
const router = express.Router()

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("./lead.controller")

// Validation
const validate = require("../../core/middleware/validate")

const {
  createLeadSchema,
  updateLeadSchema,
  idParamSchema,
} = require("./validation/lead.validation")

/* ============================
   LEAD ROUTES
============================ */

// Crear lead
router.post(
  "/",
  validate(createLeadSchema),
  createLead
)

// Obtener todos los leads
router.get("/", getLeads)

// Obtener un lead por ID
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  getLeadById
)

// Actualizar lead
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateLeadSchema),
  updateLead
)

// Eliminar lead
router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  deleteLead
)

module.exports = router