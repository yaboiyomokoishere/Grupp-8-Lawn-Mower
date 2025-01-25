const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");



const getCustomerInfo = asyncHandler(async (req,res) => {
    const {id} = req.user;
    const user = await User.findById(id); 
    
    if (user) {
        //console.log(user);
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error("Error: user not found");
    }
});

const updateCustomerProfile = asyncHandler(async (req,res) => {
    const {id} = req.user;
    const user = await User.findById(id).select("-password"); 
    if(!user){
        return res.status(404).json("User not found");
    }
    // The customer email is being updated.
    if (req.body.email && req.body.email !== user.email) { 
        const sameUser = await User.findOne({ email: req.body.email });
        if (sameUser && sameUser.id !== user.id) { // Email is already registered by another user
            res.status(400).json({ message: 'Email already taken.' });
        } else { // Email is not registered by another user
            user.email = req.body.email;
            console.log("Email updated.");
        }
    } 
    
    // Check whether each field is being updated
    if (req.body.password) {
        const hashedPassword = await bcrypt.hash(password, 10); 
        if (hashedPassword !== user.password) { // pass is being changed
            user.password = req.body.password;
            console.log("Password updated.");
        }
    }
    if (req.body.first_name && req.body.first_name !== user.first_name) {
        user.first_name = req.body.first_name;
        console.log("First name updated.");
    }
    if (req.body.last_name && req.body.last_name !== user.last_name) {
        user.last_name = req.body.last_name;
        console.log("Last name updated.");
    }
    if(req.body.phone_number && req.body.phone_number !== user.customer_details.phone_number) {
        user.customer_details.phone_number = req.body.phone_number;
        console.log("Phone number updated.");
    }
    if (req.body.address && req.body.address !== user.customer_details.address) {
        user.customer_details.address = req.body.address;
        console.log("Address updated.");
    }
    if (req.body.postal_code && req.body.postal_code !== user.customer_details.postal_code) {
        console.log("Postal code updated.");
        user.customer_details.postal_code = req.body.postal_code;
    }
    // Save all changes.
    await user.save();
    res.status(200).json({message: 'Profile updated successfully'});
});

const getUser = asyncHandler(async (req) => {
    const {id} = req.user;
    const user = await User.findById(id).select("-password"); 
    if(!user){
        throw new Error("User not found");
    }
    return user;
})

module.exports = {getUser, getCustomerInfo, updateCustomerProfile};