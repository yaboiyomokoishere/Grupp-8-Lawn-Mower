const mongoose = require("mongoose");

const slaSchema = mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        default: "Pending", // Other options: "Completed", "Paid", "Active", "Archived", "Fault Check"
    },
    price: {       
        type: Number, 
        default: "0",
    },
    address: {
        type: String,
        required: [true, "Address mandatory"],

    },
    // year month day
    start_date: {
        type: Date,
        required: [true, "Start date required"],
    },
    end_date: {
        type: Date,
        required: [true, "End date required"],
    },
    grass_height: {
        type: Number,
        required: true,
    },
    working_area: {
        type: Number,
        required: true,
    },
    height_MoE:{        //Margin of Error
        type: Number,
        default: 0.15, 
    },
    working_area_MoE:{
        type: Number,
        default: 0.9,
    },
    time_MoE:{
        type: Number,
        default: 1, 
    }, 
}, 
{
    timestamps: true,
});



module.exports = mongoose.model("sla", slaSchema );