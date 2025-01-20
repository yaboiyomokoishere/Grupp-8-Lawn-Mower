const asyncHandler = require("express-async-handler");
const Sla = require("../Models/slaModel");
const User = require("../Models/userModel");
const customerController = require("./customerController");

//@desc Create sla
//@route POST /api/sla/createSla
//@access private
const createSla  = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { 
        Address, 
        End_date,
        Grass_height,
        Working_area,
    } = req.body;
    
    // stolen from customerController 
    const {id} = req.user;
    const user = await User.findById(id).select("-password");

    if(!user){
        res.status(400);
        throw new Error("Not a customer");
    }
    
    try {
        console.log(user);
        // create sla and insert the users id
        const sla = await Sla.create({
            customer_id: user._id, 
            address: Address, 
            end_date: End_date, 
            grass_height: Grass_height,
            working_area: Working_area,
        });
        console.log(sla);
        // if sla is created update the users array of contracts
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


module.exports = {createSla};