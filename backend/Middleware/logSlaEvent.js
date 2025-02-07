const Log = require('../Models/slaLogModel');

const logSlaEvent = async function (sla_id, action, actor, description = "", err_message) {
    const log = await Log.findOne({sla_id: sla_id});
    if(!log) {
        res.status(400);
        throw new Error(err_message);
    }
    const event = {action: action, changed_by: actor, description: description, date: new Date()};
    log.events.push(event);
    await log.save();
}

module.exports = logSlaEvent