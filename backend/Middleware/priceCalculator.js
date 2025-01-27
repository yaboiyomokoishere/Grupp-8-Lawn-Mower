const asyncHandler = require("express-async-handler");
const PriceList = require("../Models/priceListModel");

const priceCalculator = asyncHandler(async (req, res) => {
    const { grassHeight, workingArea, robotModel } = req.body;
    if (!grassHeight || !workingArea || !robotModel) {
        res.status(400);
        throw new Error("Data is missing");
    }

    try {
        const priceList = await PriceList.findOne({ model: robotModel });
        if (!priceList) {
            res.status(404);
            throw new Error("Price list not found");
        }
        
       
    } catch (error) {

    }
});

  
module.exports = priceCalculator;


// const priceCalculator = function(grassHeight, WA, duration) {
//     const installation = 1500;
//     const dayPay = 200;
//     if (grassHeight = 1.0){
//         grassPay = 0.01
//     }
//     else if (grassHeight  = 0.5){
//         grassPay = 0.02
//     }
//     else {
//         grassPay = 0
//     }
//     if (WA <= 500){
//         WAPay = 0.7
//     }
//     else if (WA > 500 & WA <= 1000){
//         WAPay = 0.6
//     }
//     else {
//         WAPay = 0.5
//     }
//     return (((grassPay+WAPay)*WA)+installation+dayPay*duration);
//   };