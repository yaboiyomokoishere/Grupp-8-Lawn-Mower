const asyncHandler = require("express-async-handler");
const Sla = require("../Models/slaModel");
const User = require("../Models/userModel");
const customerController = require("./customerController");
const priceCalculator = require("../Middleware/priceCalculator");
//@desc Create sla
//@route POST /api/sla/createSla
//@access private
const createSla  = asyncHandler(async (req, res) => {
    try {
        // create sla and insert the users id
        const sla = await Sla.create({
            customer_id: req.user._id, 
            address: req.body.address,
            start_date: req.body.start_date, 
            end_date: req.body.end_date, 
            grass_height: req.body.grass_height,
            working_area: req.body.working_area,
        });
        if(sla) {
            res.status(201).json({message: 'Sla created successfully'});
        } else {
            res.status(400);
            throw new Error("Sla data is invalid");
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
    try {
        const filter = { _id: req.body._id };
        const update = { grass_height: req.body.grass_height,  
            working_area: req.body.working_area};

        const result = await Sla.findOneAndUpdate(filter, update)
        if(!result){
            res.status(404).json({message: 'Sla no found'});
        } else {
            res.status(201).json({message: 'Sla updated successfully'});
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
        
            let startDate = new Date(req.body.start_date);
            let endDate = new Date(req.body.end_date);
            let Difference_In_Time =
            endDate.getTime() - startDate.getTime();
            const duration = (Difference_In_Time)/(1000*60*60*24);      
            //console.log();
            var result = await priceCalculator.priceCalculator(req.body.grass_height, req.body.working_area, duration)

        
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
module.exports = {createSla, updateSla, getPrice};
