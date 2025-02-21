const PriceList = require("../Models/priceListModel");

const priceCalculator = async function( grassHeight, 
                                        workingArea, 
                                        startDate, 
                                        endDate,
                                        robotModel, 
                                        createSla = false) {
    if (!grassHeight || !workingArea || !robotModel || !startDate || !endDate) {
        throw new Error("Required parameter is missing");
    }

    //console.log(robotModel);
    let sd = new Date(startDate);
    let ed = new Date(endDate);
    let differenceInTime = ed.getTime() - sd.getTime();
    let duration = (differenceInTime)/(1000*60*60*24);
             
    try {
        const priceList = await PriceList.findOne({ model: robotModel });
        if (!priceList) {
            throw new Error("Price list not found");
        }
        
        const heightPrice = priceList.height_prices.find(hp => hp.height == grassHeight);

        if (!heightPrice) {
            throw new Error("Height not found in price list");
        }
        
        // Installation and duration prices will only be taken into account when creating.
        let installation = 0;
        let robotDailyRent = 0;
        
        if (createSla) {
            installation = priceList.installation;
            robotDailyRent = priceList.robot_daily_rent;
        } 
        
        const pricePerSquareMeter = priceList.price_per_square_meter;
        const price = (heightPrice.price + pricePerSquareMeter) * workingArea + installation + robotDailyRent*duration;

        return price;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = priceCalculator;
