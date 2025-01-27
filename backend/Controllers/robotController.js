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
    // try {
    //     if(!result){
    //         res.status(404).json({message: 'currentCutArea not found'});
    //     } else {
    //         res.status(201).json({message: 'currentCutArea calculated successfully'});
    //     }
    // } catch(error){
    //     console.log(error);
    //     res.status(400).json({message: 'Server error'});
    // }
    console.log("hello");
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
    console.log("hello");
});

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

module.exports = {registerRobot, doneCutting, startedCutting, broken, currentCutArea, getRobot};