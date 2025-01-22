const asyncHandler = require("express-async-handler");
const Sla = require("../Models/slaModel");
const User = require("../Models/userModel");
const customerController = require("./customerController");

//@desc Create sla
//@route POST /api/sla/createSla
//@access private
const createSla  = asyncHandler(async (req, res) => {
    
    // this check is redundant
    if(!user){
        res.status(400);
        throw new Error("Not a customer");
    }
    
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
        // if sla is created update the users array of contracts
        if(sla) {
            res.status(201).json({message: 'Sla created successfully'});
            // create("")
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
//@route POST /api/sla/createSla
//@access private
const updateSla  = asyncHandler(async (req, res) => {

});

module.exports = {createSla, updateSla};