const mongoose = require("mongoose");

const priceListSchema = mongoose.Schema({
    model: {
        type: String,
        required: [true, "Model required"],
        unique: [true, "Model name already taken"],
        default: "Robot 1"
    },
    height_prices: [{
        _id:false,
        height:{
            type: Number,
            required: [true, "Height required"],
        },
        price:{
            type: Number,
            required: [true, "price required"],
        }, 
    }],
    max_area: {
        type: Number,
        required: [true, "Max area required"],
        default: 5000 //kr/sqm
    },
    price_per_square_meter: {
        type: Number,
        required: [true, "Price per square meter required"],
        default: 0.5 // kr/sqm
    },
    installation:{
        type: Number,
        required: [true, "Price required"],
        default: 1500 // kr
    },
    robot_daily_rent:{
        type: Number,
        required: [true, "Price required"],
        default: 10 // kr
    }
}, 
{
    timestamps: true
}); 

module.exports = mongoose.model("price_list", priceListSchema );