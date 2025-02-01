const PriceList = require("../Models/priceListModel");

const priceCalculator = async function(grassHeight, workingArea, duration, robotModel) {
    if (!grassHeight || !workingArea || !robotModel || !duration) {
        throw new Error("Data is missing");
    }

    try {
        const priceList = await PriceList.findOne({ model: robotModel });
        if (!priceList) {
            throw new Error("Price list not found");
        }
        //console.log("priceList", priceList);
        //console.log(grassHeight)
        
        const heightPrice = priceList.height_prices.find(hp => hp.height == grassHeight);

        if (!heightPrice) {
            throw new Error("Height not found in price list");
        }
        
        const installation = priceList.installation;
        const pricePerSquareMeter = priceList.price_per_square_meter;
        const robotDailyRent = priceList.robot_daily_rent;
        const price = (heightPrice.price + pricePerSquareMeter) * workingArea + installation + robotDailyRent*duration;

        return price;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = priceCalculator;
