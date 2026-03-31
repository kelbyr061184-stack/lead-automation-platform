const Automation = require("./automation.model")
const logger = require("../../core/logger")

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
exports.createAutomation = async (req, res, next) => {
  try {
    const automation = await Automation.create(req.body)

    res.status(201).json(automation)
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| LIST
|--------------------------------------------------------------------------
*/
exports.getAutomations = async (req, res, next) => {
  try {
    const automations = await Automation.find()
      .sort({ createdAt: -1 })

    res.json(automations)
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| GET ONE
|--------------------------------------------------------------------------
*/
exports.getAutomation = async (req, res, next) => {
  try {
    const automation = await Automation.findById(req.params.id)

    if (!automation)
      return res.status(404).json({
        error: "Automation not found",
      })

    res.json(automation)
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
exports.updateAutomation = async (req, res, next) => {
  try {
    const automation = await Automation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!automation)
      return res.status(404).json({
        error: "Automation not found",
      })

    res.json(automation)
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/
exports.deleteAutomation = async (req, res, next) => {
  try {
    const automation = await Automation.findByIdAndDelete(
      req.params.id
    )

    if (!automation)
      return res.status(404).json({
        error: "Automation not found",
      })

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

/*
|--------------------------------------------------------------------------
| TOGGLE ACTIVE
|--------------------------------------------------------------------------
*/
exports.toggleAutomation = async (req, res, next) => {
  try {
    const automation = await Automation.findById(req.params.id)

    if (!automation)
      return res.status(404).json({
        error: "Automation not found",
      })

    automation.active = !automation.active
    await automation.save()

    res.json(automation)
  } catch (err) {
    next(err)
  }
}