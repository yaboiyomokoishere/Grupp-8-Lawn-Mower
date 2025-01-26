const asyncHandler = require("express-async-handler");
const Sla = require("../Models/slaModel");
const User = require("../Models/userModel");
const priceCalculator = require("../Middleware/priceCalculator");
const Log = require("../Models/slaLogModel");
const PriceList = require("../Models/priceListModel");

//@desc Create sla
//@route POST /api/sla/createSla
//@access private
const createSla  = asyncHandler(async (req, res) => {
    try {
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
            // create the log for the sla
            const date = new Date;
            //console.log(sla.customer_id)
            const log = await Log.create({
                        sla_id: sla._id,
                        events: [
                            {action: "Sla created", changed_by: sla.customer_id, date: date.now}]
                    });
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
        // maybe works
        const filter = { _id: req.query.id };
        const update = { grass_height: req.body.grass_height,  
            working_area: req.body.working_area};

        const result = await Sla.findOneAndUpdate(filter, update)
        if(!result){
            res.status(404).json({message: 'Sla not found'});
        } else {
            await updateSlaLog(req);
            res.status(201).json({message: 'Sla updated successfully'});
        }
    } catch(error){
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


const getHeightAndWorkingAreaAlternatives = asyncHandler(async (req, res) => {
    try {
        const id = '67914195fd30d6ec362d7f18'
        const alternatives = await PriceList.findById(id);
        //console.log(alternatives);
        res.status(200).json(alternatives);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Could not fetch parameter alternatives'});
    }
});


const updateSlaLog  = asyncHandler(async (req, res) => { 
    try {
        const log = Log.findById(req.body.id);
        //const log = Log.findOne({sla_id: req.body.id});
        //console.log(log.events.toObject()[0]);
        console.log(log.events);
        if(log){
            //date = new Date;
            const event = {action: 'Sla updated', changed_by: 'Me', date: '2000-10-10'};
            console.log(event);
            //db.Log.update({_id: log._id}, {$push : { events: event}});
            //await Log.updateOne({_id: log._id},{$push: {events: event}});
            //let event = 
            //var oldEvents = log.events;
            await log.events.addToSet(event);
            
            //await log.events.$push(event);
            await log.save();
            //await Log.findOneAndUpdate({_id: log._id}, {events: event});
            res.status(200).json({message: 'great'});
        } else {
            res.status(400).json({message: 'bad'});
        }
    } catch(error){
        console.log(error);
        res.status(400).json({message: 'Server error'});
    }
});

const updateSlaLogOriginal = function(req) {
    try {
        date = new Date;
        const log = Log.findOne({sla_id: req.body._id});
        var event = {action: "Sla updated", changed_by: req.customer_id, date: date.now};
        Log.update( {_id: log._id}, {$push : { events: event}}, done);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'log server error'});
    }
}


// One-time function used to fill the database
// const fillPriceList =asyncHandler(async (req, res) => {
//     try {
//         const standardPrices = await PriceList.create({
//             height_prices: [
//                 { height: "1.5", price: 0 }, // kr/kvm
//                 { height: "1", price: 0.01 },
//                 { height: "0.5", price: 0.02 }
//             ],
//             area_prices: [
//                 { area: "500", price: 0.7 },
//                 { area: "1000", price: 0.6 },
//                 { area: "2000", price: 0.5 }
//             ],
//             installation: 1500,
//             robot_daily_rent: 20
//         });
//         if(standardPrices) {
//             res.status(201).json({message: 'Price list created successfully'});
//         } else {
//             res.status(400);
//             throw new Error("Price list data is invalid");
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({message: 'Server error'});
//     }
// });


module.exports = {createSla, updateSla, getPrice, getAllSla, getSla, getHeightAndWorkingAreaAlternatives, updateSlaLog};