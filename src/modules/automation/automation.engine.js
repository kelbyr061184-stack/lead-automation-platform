const Automation = require("./automation.model");
const actions = require("./automation.actions");
const logger = require("../../core/logger");
const AutomationRun = require("../automation-run/automationRun.model");

/*
|--------------------------------------------------------------------------
| RUN AUTOMATION ENGINE
|--------------------------------------------------------------------------
*/

async function runAutomation(event, payload = {}) {
  try {
    logger.info(`⚡ Automation event: ${event}`);

    // ✅ Buscar SOLO automations activas del evento
    const automations = await Automation.find({
      triggerEvent: event,
      status: "active",
    });

    if (!automations.length) {
      logger.warn("No automations found");
      return;
    }

    for (const automation of automations) {
      logger.info(`🔥 Running automation: ${automation.name}`);

      // ✅ Crear historial
      const run = await AutomationRun.create({
        automation: automation._id,
        lead: payload?._id || null,
        status: "running",
        logs: [],
        startedAt: new Date(),
      });

      const logs = [];

      try {
        for (const step of automation.actions || []) {
          const action = actions[step.type];

          if (!action) {
            const message = `Action not found: ${step.type}`;
            logger.warn(message);

            logs.push({
              message,
              date: new Date(),
            });

            continue;
          }

          try {
            const message = `Executing action: ${step.type}`;
            logger.info(message);

            logs.push({
              message,
              date: new Date(),
            });

            await action(payload, step.config || {});
          } catch (err) {
            const message = `Action failed: ${step.type}`;

            logger.error(message);
            logger.error(err);

            logs.push({
              message: `${message} - ${err.message}`,
              date: new Date(),
            });
          }
        }

        // ✅ SUCCESS
        run.status = "completed";
        run.finishedAt = new Date();
        run.logs = logs;

        await run.save();
      } catch (error) {
        logger.error(error);

        run.status = "failed";
        run.error = error.message;
        run.finishedAt = new Date();
        run.logs = logs;

        await run.save();
      }
    }

    logger.info(`✅ Automation completed for ${event}`);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  runAutomation,
};