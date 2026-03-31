const { z } = require("zod")

/*
|--------------------------------------------------------------------------
| CREATE LEAD
|--------------------------------------------------------------------------
*/
const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().optional(),
})

/*
|--------------------------------------------------------------------------
| UPDATE LEAD
|--------------------------------------------------------------------------
*/
const updateLeadSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
})

/*
|--------------------------------------------------------------------------
| PARAM VALIDATION
|--------------------------------------------------------------------------
*/
const idParamSchema = z.object({
  id: z.string().min(24),
})

module.exports = {
  createLeadSchema,
  updateLeadSchema,
  idParamSchema,
}