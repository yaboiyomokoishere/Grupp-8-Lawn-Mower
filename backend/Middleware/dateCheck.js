const Sla = require("../Models/slaModel");
const logSlaEvent = require("./logSlaEvent");
const Robot = require("../Models/robotModel");

const dateCheck = async function() {
    const date =  Date.now();
    //const day = date.getTime();
    try {
        // should return all SLA that is not archived or cancelled
        const result = await Sla.find({status: { $ne: "Archived"}});
        
        while(result.length > 0){
            const sla = result.pop();
            const comp = dateComparison(date, sla.end_date);
            
            // if end date has passed
            if(comp < 0  && sla.status != "Fault"){//
                console.log(sla);
                console.log(comp);
                if(sla.status != "Completed") {
                    sla.status = "Fault";
                    await sla.save();
                    await logSlaEvent(sla.id, "Sla Fault", "System", "Logging error while auto end sla"); 
                }
                else{
                    sla.status = "Archived";
                    await sla.save();
                    await logSlaEvent(sla.id, "Sla Archived", "System", "Logging error while auto end sla"); 
                }
                robot = await Robot.findOne({sla_id: sla._id});
                if(robot){
                    robot.status = "Available";
                    robot.booking_schedule.pop();
                    await robot.save();
                }      
            }
        }
        console.log("Termination check done");
    }catch (error) {
        console.log(error);
    }
}

const dateComparison = function (date1, date2) {
    // make sure input is date object
    var dateOne = new Date(date1);
    var dateTwo = new Date(date2);
    // create Date object for comparrison without hours 
    var one = new Date(dateOne.getFullYear(), dateOne.getMonth(), dateOne.getDate());
    var two = new Date(dateTwo.getFullYear(), dateTwo.getMonth(), dateTwo.getDate());

    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    // return difference in days
    return Math.floor(days);
}

module.exports = dateCheck;