const express = require("express")
const router = express.Router()

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("./lead.controller")

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
const validate = require("../../core/middleware/validate")
const auth = require("../../middlewares/auth.middleware") // ✅ JWT Middleware

/*
|--------------------------------------------------------------------------
| Validation Schemas
|--------------------------------------------------------------------------
*/
const {
  createLeadSchema,
  updateLeadSchema,
  idParamSchema,
} = require("./validation/lead.validation")

/* ==========================================================
   LEAD ROUTES (PROTECTED 🔐)
========================================================== */

/*
|--------------------------------------------------------------------------
| Crear Lead
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  auth,
  validate(createLeadSchema),
  createLead
)

/*
|--------------------------------------------------------------------------
| Obtener todos los leads
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  auth,
  getLeads
)

/*
|--------------------------------------------------------------------------
| Obtener lead por ID
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  auth,
  validate(idParamSchema, "params"),
  getLeadById
)

/*
|--------------------------------------------------------------------------
| Actualizar lead
|--------------------------------------------------------------------------
*/
router.put(
  "/:id",
  auth,
  validate(idParamSchema, "params"),
  validate(updateLeadSchema),
  updateLead
)

/*
|--------------------------------------------------------------------------
| Eliminar lead
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  auth,
  validate(idParamSchema, "params"),
  deleteLead
)

module.exports = router