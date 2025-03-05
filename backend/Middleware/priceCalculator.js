const { model } = require("mongoose");
const PriceList = require("../Models/priceListModel");
const Sla = require("../Models/slaModel")

const priceCalculator = async function( grassHeight, 
                                        workingArea, 
                                        startDate, 
                                        endDate,
                                        robotModel,
                                        slaId, 
                                        createSla = false) {
    // Check the necessary inputs
    if (!robotModel || !startDate || !endDate) {
        throw new Error("Required parameter is missing.");
    }
    let price = 0;
    // Installation and duration prices will only be taken into account when creating a sla.
    let installation = 0;
    let robotDailyRent = 0;
    let pricePerSquareMeter = 0;
    let heightCost = 0;
    // Time difference from start to end of contract.
    let sd = new Date(startDate);
    let ed = new Date(endDate);
    let differenceInTime = ed.getTime() - sd.getTime();
    let duration = (differenceInTime)/(1000*60*60*24);

    const modelPriceList = await PriceList.findOne({ model: robotModel });
    if (!modelPriceList) {
        throw new Error("Price list for the model " + robotModel + " was not found.");
    }
            
    if(createSla){
        if (grassHeight == undefined || workingArea == undefined){
            throw new Error("Cannot create sla because either the grass height or the working area are not defined.");
        }
        try {
            // Extract the installation and daily rent prices together with the respective grass height price.   
            installation   = modelPriceList.installation; // in kr
            robotDailyRent = modelPriceList.robot_daily_rent; // in kr
            pricePerSquareMeter = modelPriceList.price_per_square_meter; 

            heightPriceObject = modelPriceList.height_prices.find(hp => hp.height == grassHeight);
            heightCost = heightPriceObject.price;
            if (heightCost == undefined) {
                throw new Error("Could not find a price for the selected height.");
            }
            price = (heightCost * workingArea) + (pricePerSquareMeter * workingArea) + installation + robotDailyRent * duration;
        } catch (error) {
            console.log(error)
        }
    } else { // Update.
        try {
            const sla = await Sla.findById(slaId);
            
            let areaDifference = 0;
            let newAreaCost = 0; 
            let newGrassHeightPrice=0;
            let oldGrassHeightPrice=0;
            let grassHeightPriceDifference = 0;
            let newGrassHeightCost=0;
            // If the grass height has been changed fetch the price for both the old
            // and the new one.
            if(grassHeight != sla.grass_height){
                tmp = modelPriceList.height_prices.find(hp => hp.height == grassHeight);
                newGrassHeightPrice = tmp.price
                tmp = modelPriceList.height_prices.find(hp => hp.height == sla.grass_height);
                oldGrassHeightPrice = tmp.price;
                // Increase in grass height -> Price is lower -> Negative value: return money.
                grassHeightPriceDifference = newGrassHeightPrice - oldGrassHeightPrice;
            }

            if(workingArea != sla.working_area){
                areaDifference = workingArea - sla.working_area;
            }

            if (areaDifference != 0){
                if (areaDifference > 0) { // Area increased.
                    newAreaCost = (modelPriceList.price_per_square_meter + newGrassHeightPrice) * areaDifference;
                    if (grassHeightPriceDifference != 0){ // Grass height changed.
                        newGrassHeightCost = grassHeightPriceDifference * sla.working_area;
                    }
                } else { // Area decreased
                    newAreaCost = (modelPriceList.price_per_square_meter + oldGrassHeightPrice) * areaDifference;
                    if (grassHeightPriceDifference != 0){ // Grass height changed.
                        newGrassHeightCost = grassHeightPriceDifference * workingArea;
                    }
                }
            } else if (grassHeightPriceDifference != 0){
                newGrassHeightCost = grassHeightPriceDifference * workingArea;
            }
            price = newGrassHeightCost + newAreaCost;
        } catch (error) {
            console.log(error)
        }
    }
    return price;        
};

module.exports = priceCalculator;