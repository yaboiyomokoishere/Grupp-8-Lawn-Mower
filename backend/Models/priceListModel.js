const mongoose = require("mongoose");

const priceListSchema = mongoose.Schema({
    height: {// kr/kvm
        type: Number,
        required: [true, "Name required"],
    },
    working_area: {// kr/kvm
        type: Number,
        required: [true, "Price required"],
    },
    installation:{
        type: Number,
        required: [true, "Price required"],
    },
    robot_daily_rent:{
        type: Number,
        required: [true, "Price required"],
    }
},
{
    timestamps: true,
}); 

module.exports = mongoose.model("price_list", priceListSchema );