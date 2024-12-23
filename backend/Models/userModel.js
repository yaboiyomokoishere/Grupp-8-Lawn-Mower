const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Add a first name"],

    },
    last_name: {
        type: String,
        required: [true, "Add a last name"],
    },
    email: {
        type: String,
        required: [true, "Add user email address"],
        unique: [true, "Email already taken"],

    },
    address: {
        type: String,
        required: [true, "Add user address"],

    },
    postal_code: {
        type: Number,
        required: [true, "Add user postal code"],
    }, 
    phone_number: {
        type: Number,
        required: [true, "Add user phone number"],
    },
    role: {
        type: String,
        required: [true, "Add user role"],
    },
    password: {
        type: String,
        required: [true, "Add user password"],
        select: true
    },
    contracts: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sla',
        default: []
    }], 
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema );