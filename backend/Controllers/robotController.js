const asyncHandler = require("express-async-handler");
const Robot = require("../Models/mowingRobotModel");
const Sla = require("../Models/slaModel");
const Log = require("../Models/slaLogModel");


const createRobot  = asyncHandler(async (req, res) => { 
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
        res.status(400).json({message: 'Server error'});
    }
});

const start  = asyncHandler(async (req, res) => { 
    try {
        
        const sla = await Sla.findById(req.body.sla_id);
        
        if (sla) {
            sla.status = "Active";
            await sla.save();
            const log = await Log.findOne({sla_id: req.body.sla_id});
            if(!log){
                res.status(404).json({message: 'Sla log not found'});
            } else {
                const event = {action: "Sla updated", changed_by: "System", date: new Date()};
                log.events.push(event);
                await log.save();
            }
            //console.log(result);
            res.status(201).json({message: 'ok'});
        }
        else {
            res.status(404).json({message: 'inte ok'});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const currentCutArea  = asyncHandler(async (req, res) => { 
    try {
      
        const result = await Robot.findOne({serial_number: req.body.serial_number});
        
        if(!result){
            res.status(404).json({message: 'currentCutArea not found'});
        } else {
            res.status(201).json({message: 'currentCutArea calculated successfully'});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const done  = asyncHandler(async (req, res) => { 
    try {
      

        
        if(!result){
            res.status(404).json({message: 'Robot not found'});
        } else {
            res.status(201).json({message: 'Robot is done'});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const broken  = asyncHandler(async (req, res) => { 
    try {
      
        
        
        if(!result){
            res.status(404).json({message: 'Robot not found'});
        } else {
            res.status(201).json({message: 'Robot is broken'});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

module.exports = {createRobot, done, start, broken, currentCutArea};