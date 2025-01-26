const mongoose = require("mongoose");

const priceListSchema = mongoose.Schema({
    model: {
        type: String,
        required: [true, "model required"],
    },
    height_prices: [{// kr/kvm
        height:{
            type: String,
            required: [true, "Height required"],
        },
        price:{
            type: Number,
            required: [true, "price required"],
        }    
    }],
    area_prices: [{// kr/kvm
        area:{
            type: String,
            required: [true, "Height required"],
        },
        price:{
            type: Number,
            required: [true, "price required"],
        } 
    }],
    installation:{
        type: Number,
        required: [true, "Price required"],
    },
    robot_daily_rent:{
        type: Number,
        required: [true, "Price required"],
    }
}); 

module.exports = mongoose.model("price_list", priceListSchema );