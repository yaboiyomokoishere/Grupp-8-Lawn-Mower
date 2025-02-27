const asyncHandler = require("express-async-handler");
const Robot = require("../Models/robotModel");
const Sla = require("../Models/slaModel");
const PriceList = require("../Models/priceListModel");
const logSlaEvent = require("../Middleware/logSlaEvent");



const registerRobot  = asyncHandler(async (req, res) => { 
    // for (let i = 0; i < 200; i++) {
    const serial_number = req.body.serial_number;
    const robot = await Robot.create({ serial_number });
    console.log(robot);
    // }
    res.status(200).json({message: 'Robots created successfully'});
    // try {
    //     const robot = await Robot.create({
    //         model: req.body.model,
    //         serial_number: req.body.serial_number,
    //         last_maintenance_date: req.body.last_maintenance_date
    //     });
    //   console.log(robot);

    //     if(!robot){
    //         res.status(400).json({message: 'robot failed'});
    //     } else {
    //         res.status(200).json({message: 'Robot created successfully'});
    //     }
    // } catch(error){
    //     console.log(error);
    //     res.status(400).json({message: 'Could not register robot'});
    // }
});



const startedCutting  = asyncHandler(async (req, res) => { 
    try {
        const sla = await Sla.findById(req.body.sla_id);
        if (sla) {
            sla.status = "Active";
            await sla.save();
            const description = "Robot has started cutting the grass.";
            const err = "Error while logging status change to active";
            const actor = "System";
            const event = "Sla status changed to active"; 
            logSlaEvent(sla.id, event, actor, description, err);
            
            //console.log(result);
            res.status(201).json({message: 'Sla status updated successfully'});
        }
        else {
            res.status(404).json({message: 'Sla not found'});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});


const currentCutArea  = async (req, res) => { 
    try {
        const sla = await Sla.findById(req.body.sla_id);
        const newCutArea = parseInt(req.body.currentCutArea);
        if(sla){
            if (newCutArea < sla.working_area) {
                //console.log(newCutArea)
                const previousCutArea = sla.current_cut_area;
                sla.current_cut_area += newCutArea;
                await sla.save();
                const description = "The current cut area has been updated from " + 
                                    previousCutArea + " to " + sla.current_cut_area + " kr.";
                const err = "Error while logging status change to active";
                const actor = "Robot";
                const event = "Sla current cut area update."; 
                logSlaEvent(sla.id, event, actor, description, err);
                res.status(200).json({message: "Updated succesfully"});    
            }
        } else {
            res.status(404).json({message: "Sla not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
};


const doneCutting  = asyncHandler(async (req, res) => { 
    try {
        const sla = await Sla.findById(req.body.sla_id);
        if (sla) {
            sla.status = "Completed";
            sla.currentCutArea = sla.working_area;
            await sla.save();
            const description = "The robot has finished the paid service. Current cut area is " + sla.currentCutArea + ".";
            const err = "Error while logging status change from active to Completed.";
            const actor = "Robot";
            const event = "Service completed."; 
            logSlaEvent(sla.id, event, actor, description, err);

            //logSlaEvent(sla.id, "Sla status changed to completed", "System", "Error while logging sla status change to");
            //console.log(result);
            res.status(201).json({message: 'Sla status updated successfully'});
        }
        else {
            res.status(404).json({message: 'Sla not found'});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const broken  = asyncHandler(async (req, res) => { // Cancel all future bookings
    try {
        const robot = await Robot.findOne({serial_number: req.body.serial_number});
        const booking = robot.booking_schedule.pop();
        const sla = await Sla.findOne({_id: booking.sla_id});

        if(robot && sla){
            robot.status = "Broken";
            // todo loop over the booking shedule
            robot.booking_schedule.pop();

            sla.status = "Cancelled";
            //const event = {action: "System Cancellation", changed_by: req.body.serial_number, date: new Date()};
        
            await sla.save();
            await robot.save();

            const description = "Something went wrong with the robot. Status updated to Cancelled." ;
            const err = "Error during service, the robot stopped working.";
            const actor = "Robot";
            const event = "Technical error."; 
            logSlaEvent(sla.id, event, actor, description, err);
        }
        res.status(200).json({message: 'Broken successfully'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const maintenance = asyncHandler(async (req, res) => {
    try {
        const robot = await Robot.findOne({serial_number: req.body.serial_number});
        robot.status = "Available";
        //const date = new Date;
        robot.last_maintenance_date = Date.now();
        await robot.save();
        res.status(200).json({message: 'working again!!!'});

    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
})

const getRobot = asyncHandler(async (req, res) => { 
    try {
        const result = await Robot.findOne({serial_number: req.query.serial_number});
        if(!result){
            res.status(404).json({message: 'Robot not found'});
        } else {
            res.status(200).json({result});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const getAllRobots = asyncHandler(async (req, res) => {
    const robots = await Robot.find({status: req.query.status});
    //console.log(robots);
    if(!robots) {
        res.status(404);
        throw new Error("No robots found");
    }
    res.json(robots);
});

// låtsas ping till robot
const getBooking = asyncHandler(async (req, res) => { 
    try {
        const robot = await Robot.findOne({serial_number: req.query.serial_number});
        if(!result){
            res.status(404).json({message: 'Robot not found'});
        } else {
            // konstruera ett medalande med datan den vill ha
            res.status(200).json({result});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const getAllPriceLists = asyncHandler(async (req, res) => {
    const priceLists = await PriceList.find();
    // console.log(priceLists)
    if(priceLists.length > 0) {
        // console.log("At least one price list found")
        return res.status(200).json(priceLists);
    } else {
        return res.status(404).json({message: 'Error while fetching price lists.'});
    }   
});



module.exports = {registerRobot, doneCutting, startedCutting, broken, currentCutArea, getRobot,getAllRobots, maintenance, getBooking, getAllPriceLists};