const asyncHandler = require("express-async-handler");
const Sla = require("../Models/slaModel");
const User = require("../Models/userModel");
const priceCalculator = require("../Middleware/priceCalculator");
const Log = require("../Models/slaLogModel");
const PriceList = require("../Models/priceListModel");
const Robot = require("../Models/robotModel");

//@desc Create sla
//@route POST /api/sla/createSla
//@access private
const createSla  = asyncHandler(async (req, res) => {
    try {

        const robot = await Robot.findOne({status: "Available"});
        if(robot){
            // create sla and insert the users id
            const sla = await Sla.create({
                customer_id: req.user.id, 
                address: req.body.address,
                start_date: req.body.start_date, 
                end_date: req.body.end_date, 
                grass_height: req.body.grass_height,
                working_area: req.body.working_area,
                price: req.body.total_price,
            });
            //console.log(sla)
            if(sla) {
                // scuffed booking of a robot
                robot.status = "Unavailable";
                const booking = {sla_id: sla._id, start_date: sla.start_date, end_date: sla.end_date};
                robot.booking_schedule.push(booking);
                await robot.save();
                // create the log for the sla
                const date = new Date;
                //console.log(sla.customer_id)
                const log = await Log.create({
                            sla_id: sla._id,
                            events: [
                                {action: "Sla created", changed_by: sla.customer_id, date: date.now}
                            ]
                        });
                if(!log) {
                    res.status(400);
                    throw new Error("Sla log not created");
                }
                res.status(201).json({message: 'Sla created successfully'});
            } else {
                res.status(400);
                throw new Error("Sla data is invalid");
            }
        } else {
            res.status(400).json({message: 'No available robot'});
        }       
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

//@desc Create sla
//@route POST /api/sla/updateSla
//@access private
const updateSla  = asyncHandler(async (req, res) => { 
    console.log(req.body)
    if(!req.body.grass_height && !req.body.working_area) {
        res.status(403).json({message: "Atleast a field is required"})
    } else{
        try {
            const sla = await Sla.findById(req.body.id);
            const log = await Log.findOne({sla_id: req.body.id});
            // if allowed to edit SLA
            if(sla.status == "Pending" || sla.status == "Paid" || sla.status == "Active") {
                // if SLA and log found
                if(sla && log){
                    // check for what is changed
                    if(req.body.grass_height){
                        sla.grass_height = req.body.grass_height;
                    }
                    if(req.body.working_area){
                        sla.working_area = req.body.working_area;
                    }
                    sla.price = req.body.price;
                    // Update log
                    const event = {action: "Sla updated", changed_by: req.user.id, date: new Date()};
                    log.events.push(event);
                    // Update db
                    await sla.save();
                    await log.save();
                    res.status(201).json({message: 'Sla updated successfully'});               
                } else {
                    res.status(404).json({message: 'Sla not found'});
                }              
            } else {
                res.status(404).json({message: 'Wrong status, can not update sla'});
            }    
        } catch(error){
            console.log(error);
            res.status(400).json({message: 'Server error'});
        }
    }  
});

const cancelSla = asyncHandler (async (req, res) =>{
    
    try{
        const sla = await Sla.findOne({_id: req.body.id});
        const log = await Log.findOne({sla_id: req.body.id });
        const robot = await Robot.findOne({'booking_schedule.sla_id': 'req.body.id'});
        console.log(robot);
        robot.status = "Available";
        // Works as long as only one booking at a time
        robot.booking_schedule.pop();
        console.log(robot);
        await robot.save();
        if (!sla || !log){
            res.status(404).json({message: 'Sla or log not found'});
        }
        else {
            const event = {action: "Manual Cancellation", changed_by: req.user.id, date: new Date()};
            log.events.push(event);
            sla.status = "Cancelled";
            await log.save();
            await sla.save();
            res.status(200).json({message: 'Cancellation successful'});
        }
    } catch (error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

//@desc Returns all slas belonging to a user
//@route POST /api/sla/getAllSla
//@access private
const getAllSla  = asyncHandler(async (req, res) => { 
    try {
        const {id} = req.user;
        const user = await User.findById(id).select("-password");
        const result = await Sla.find({customer_id: user._id}); // req.user.id
        if(!result){
            res.status(404).json({message: 'Sla not found'});
        } else {
            //console.log(result)
            res.status(200).json({result});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

//@desc Returns all slas belonging to a user
//@route POST /api/sla/getAllSla
//@access private
const getSla  = asyncHandler(async (req, res) => { 
    // console.log(req.query.id)
    try {
        const result = await Sla.findOne({_id: req.query.id});
        if(!result){
            res.status(404).json({message: 'Sla not found'});
        } else {
            res.status(200).json({result});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

//@desc getPrice
//@route GET /api/sla/getPrice
//@access private
const getPrice  = asyncHandler(async (req, res) => { 
    try {
        // let robotModel = req.body.robot_model;
        let robotModel = "Robot 1"; // Hardcoded for testing 
        let startDate = new Date(req.body.start_date);
        let endDate = new Date(req.body.end_date);
        let Difference_In_Time = endDate.getTime() - startDate.getTime();
        let duration = (Difference_In_Time)/(1000*60*60*24);      
        
        var result = await priceCalculator(req.body.grass_height, req.body.working_area, duration, robotModel)
        if(!result){
            res.status(404).json({message: 'result not found'});
        } else {
            res.status(200).json({result});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});


const getHeightAndWorkingAreaAlternatives = asyncHandler(async (req, res) => {
    try {
        const alternatives = await PriceList.findOne({ model: "Robot 1" }); // Hardcoded for testing
        //console.log(alternatives);
        res.status(200).json(alternatives);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Could not fetch parameter alternatives'});
    }
});

const updateSlaLog = asyncHandler(async (req, res) => { 
    console.log(req.body.id);
    try {
        const log = await Log.findOne({sla_id: req.body.id});
        if(!log){
            res.status(404).json({message: 'Sla log not found'});
        } else {
            res.status(200).json(log);
        }    

        const event = {action: "Sla updated", changed_by: req.user.id, date: new Date()};

        log.events.push(event);
        await log.save();
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const getSlaLog = asyncHandler(async (req, res) => { 
    try {
        const id = req.query.id
        const log = await Log.findOne({sla_id: id});
        if(!log){
            res.status(404).json({message: 'Sla log not found'});
        } else {
            res.status(200).json(log);
        }    
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const getSlaPriceList = asyncHandler(async (req, res) => { 
    try {
        const id = req.query.id
        
        const sla = await Sla.findById(id)
        if(!sla){
            res.status(404).json({message: 'Sla not found'});
        }
        //console.log(sla)
        const robotModel = sla.assigned_robot_model
        if (!robotModel) {
            res.status(404).json({message: 'Robot model not found'});
        }
        //console.log(robotModel)
        const prices = await PriceList.findOne({model: robotModel});
        if(!prices){
            res.status(404).json({message: 'Price list not found'});
        } else {
            //console.log(prices);
            res.status(200).json(prices);
        }    
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});


module.exports = {createSla, 
                updateSla, 
                getPrice, 
                getAllSla, 
                getSla, 
                getHeightAndWorkingAreaAlternatives,
                updateSlaLog,
                cancelSla, 
                getSlaLog,
                getSlaPriceList
            };
