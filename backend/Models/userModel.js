const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Add a username"],

    },
    email: {
        type: String,
        required: [true, "Add user email address"],
        unique: [true, "Email already taken"],

    },
    password: {
        type: String,
        required: [true, "Add user password"],

    },
}, 
{
    timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema );