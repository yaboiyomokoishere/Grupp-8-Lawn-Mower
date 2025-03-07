const asyncHandler = require("express-async-handler");
const Sla = require("../Models/slaModel");
const User = require("../Models/userModel");
const priceCalculator = require("../Middleware/priceCalculator");
const logSlaEvent = require ("../Middleware/logSlaEvent");
const Log = require("../Models/slaLogModel");
const PriceList = require("../Models/priceListModel");
const Robot = require("../Models/robotModel");

//@desc Create sla
//@route POST /api/sla/createSla
//@access private
const createSla  = asyncHandler(async (req, res) => {
    try {
        const robot = await Robot.findOne({status: "Available", model: req.body.robot_model }); // add assigned model
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
                assigned_robot_model: req.body.robot_model
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
        res.status(400).json({message: 'Robots not available'});
    }
});

//@desc Create sla
//@route POST /api/sla/updateSla
//@access private
const updateSla  = asyncHandler(async (req, res) => { 
    // console.log(req.body)
    if(!req.body.grass_height && !req.body.working_area) {
        res.status(403).json({message: "Atleast a field is required"})
    } else{
        try {
            const sla = await Sla.findById(req.body.id);
            let description = "";
            // if allowed to edit SLA
            if(sla.status == "Pending" || sla.status == "Paid" || sla.status == "Active") {
                // if SLA and log found
                if(sla){
                    // check for what is changed
                    if(req.body.grass_height){
                        description = "The grass height changed to " + req.body.grass_height + " cm from " + sla.grass_height + " cm .";
                        sla.grass_height = req.body.grass_height;
                    }
                    if(req.body.working_area){                      
                        description = "The working area changed to " + req.body.working_area + " kvm from " + sla.working_area + " kvm.";
                    }
                    sla.working_area = req.body.working_area;
                    
                    sla.price += req.body.update_cost;
                    description = description + " The cost for the changes was  " + req.body.update_cost + " kr.";
                    // Update db
                    logSlaEvent(sla.id, "Sla updated", req.user.id, description, "Logging error while updating sla");
                    await sla.save();
                    //console.log(sla);
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
        const robot = await Robot.findOne({'booking_schedule.sla_id': req.body.id});
        console.log(robot);
        robot.status = "Available";
        // Works as long as only one booking at a time
        robot.booking_schedule.pop();
        //console.log(robot);
        await robot.save();
        if (!sla){
            res.status(404).json({message: 'Sla or log not found'});
        }
        else {
            sla.status = "Cancelled";
            sla.endDate = Date.now();
            let description = "End date updated to " + sla.endDate + " from " + sla.end_date + 
                               " and status changed to " + sla.status + " from " + sla.status + ".";
            logSlaEvent(sla.id, "Manual Cancellation", req.user.id, description, "Logging error while cancelling sla");
            await sla.save();
            res.status(200).json({message: 'Cancellation successful'});
        }
    } catch (error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const deleteSla = asyncHandler (async (req, res) =>{
    try{

         const robot = await Robot.findOne({'booking_schedule.sla_id': req.body.id});
         console.log(robot);
         robot.status = "Available";
         robot.booking_schedule.pop();
        
        await robot.save();

        const sla = await Sla.deleteOne({_id: req.body.id});
        const log = await Log.deleteOne({sla_id: req.body.id});
        
        // Works as long as only one booking at a time
        
        //console.log(robot);
        
        if (!sla){
            res.status(404).json({message: 'Sla or log not found'});
        }
        else {
            res.status(200).json({message: 'Deletion successful'});
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
    console.log("--------------------")
    console.log(req.body) 
    console.log("--------------------")
    try {
        let createSla = false;
        if(req.body.create_sla){ 
            createSla = true;
            console.log("Creating SLA...");
        } else {
            console.log("Updating SLA...");
        }

        var result = await priceCalculator( 
            req.body.grass_height, 
            req.body.working_area, 
            req.body.start_date,
            req.body.end_date, 
            req.body.robot_model, 
            req.body.id,
            createSla,
        )
         
        console.log("The price is ", result)
        if(!result){
            res.status(404).json({message: 'Error while calculating a price.'});
        } else {
            res.status(200).json({result});
        }
    } catch(err){
        console.log(err);
        res.status(400).json({error: 'Server error: ' + err});
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
                cancelSla, 
                deleteSla,
                getSlaLog,
                getSlaPriceList, 
            };
