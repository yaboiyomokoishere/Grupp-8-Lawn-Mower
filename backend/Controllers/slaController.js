const asyncHandler = require("express-async-handler");
const Sla = require("../Models/slaModel");
const PriceList = require("../Models/priceListModel");

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

const getHeightAndWorkingAreaAlternatives = asyncHandler(async (req, res) => {
    try {
        let id = '67914195fd30d6ec362d7f18'
        const alternatives = await PriceList.findById(id);
        //console.log(alternatives);
        res.status(200).json(alternatives);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Could not fetch parameter alternatives'});
    }
});



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



module.exports = {createSla, updateSla, getHeightAndWorkingAreaAlternatives }; 