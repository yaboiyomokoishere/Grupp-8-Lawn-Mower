const asyncHandler = require("express-async-handler");
const Robot = require("../Models/robotModel");
const Sla = require("../Models/slaModel");
const Log = require("../Models/slaLogModel");


const registerRobot  = asyncHandler(async (req, res) => { 
    try {
        const robot = await Robot.create({
            model: req.body.model,
            serial_number: req.body.serial_number,
            last_maintenance_date: req.body.last_maintenance_date
        });
      console.log(robot);

        if(!robot){
            res.status(400).json({message: 'robot failed'});
        } else {
            res.status(200).json({message: 'Robot created successfully'});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Could not register robot'});
    }
});

const startedCutting  = asyncHandler(async (req, res) => { 
    try {
        const sla = await Sla.findById(req.body.sla_id);
        if (sla) {
            sla.status = "Active";
            await sla.save();
            const log = await Log.findOne({sla_id: req.body.sla_id});
            if(!log){
                res.status(404).json({message: 'Sla log not found'});
            } else {
                const event = {action: "Sla status changed to active", changed_by: "System", date: new Date()};
                log.events.push(event);
                await log.save();
            }
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

// Assume 
const currentCutArea  = asyncHandler(async (req, res) => { 
    try {
        const sla = await Sla.findById(req.body.sla_id);
        if(sla){
            sla.currentCutArea = req.body.currentCutArea;
            await sla.save();
            res.status(200).json({message: "Updated succesfully"});
        } else {
            res.status(404).json({message: "Sla not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const doneCutting  = asyncHandler(async (req, res) => { // Update SLA status to finished service
    try {
        const sla = await Sla.findById(req.body.sla_id);
        if (sla) {
            sla.status = "Completed";
            await sla.save();
            const log = await Log.findOne({sla_id: req.body.sla_id});
            if(!log){
                res.status(404).json({message: 'Sla log not found'});
            } else {
                const event = {action: "Sla status changed to completed", changed_by: "System", date: new Date()};
                log.events.push(event);
                await log.save();
            }
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
        const log = await Log.findOne({sla_id: sla._id});

        if(robot && sla && log){
            robot.status = "Broken";
            // todo loop over the booking shedule
            robot.booking_schedule.pop();

            sla.status = "Cancelled";
            const event = {action: "System Cancellation", changed_by: req.body.serial_number, date: new Date()};
            log.events.push(event);
            await log.save();
            await sla.save();
            await robot.save();
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

module.exports = {registerRobot, doneCutting, startedCutting, broken, currentCutArea, getRobot, maintenance, getBooking};