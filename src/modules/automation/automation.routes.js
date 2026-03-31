const router = require("express").Router()
const controller = require("./automation.controller")

router.post("/", controller.createAutomation)
router.get("/", controller.getAutomations)
router.get("/:id", controller.getAutomation)
router.patch("/:id", controller.updateAutomation)
router.delete("/:id", controller.deleteAutomation)

// ⭐ toggle
router.patch("/:id/toggle", controller.toggleAutomation)

module.exports = router