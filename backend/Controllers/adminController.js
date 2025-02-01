const asyncHandler = require("express-async-handler");
const PriceList = require("../Models/priceListModel");


const createPriceList = asyncHandler(async (req, res) => {
    // Created a price list for testing. Most values are defaults in the model and the
    // height prices are hardcoded. The actual implementation receives all values from 
    // the request. 
    try {

        heightPrices = [
            {height:1.5, price:0},
            {height:1.0, price:0.01},
            {height:0.5, price:0.02}
        ];
        
        await PriceList.create({ 
            height_prices: heightPrices
        });
        res.status(200).json({message: 'Price list created successfully'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Error while creating price list'});
    }
});

module.exports = {createPriceList};