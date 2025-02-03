const Sla = require("../Models/slaModel");

const dateCheck = async function() {
    const date =  Date.now();
    //const day = date.getTime();
    try {
        const result = await Sla.find();
        console.log(result);
        while(result != "") {
            const sla = result.pop();
            const comp = dateComparison(date, sla.end_date);
            console.log(sla);
            console.log(comp);
            
            if(comp < 0 && sla.status != "Completed"){
                sla.status = "Fault";
                await sla.save();  
            }
            else if(comp < 0 && sla.status == "Completed"){
                sla.status = "Fault";
                await sla.save();
            }
        } 
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