const asyncHandler = require("express-async-handler");
const PriceList = require("../Models/priceListModel");
const User = require("../Models/userModel");


const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({role: req.query.role});
    if(!users) {
        res.status(404).json({message: 'error while fetching list of type ' + req.body.role});
    }
    res.status(200).json(users);
});

const getUser = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const user = await User.findById(id); 
    if(!user){
        res.status(404).json({message: 'User not found'});
        throw new Error("User not found");
    }
    res.status(200).json(user);
});


const toggleUserStatus = asyncHandler(async (req, res) => {
    const id = req.body.id;
    const user = await User.findById(id);
    if (!user) {
        res.status(404).json({ message: 'Error while searching for the user.' });
        return;
    }
    user.status = user.status === 'active' ? 'inactive' : 'active';
    //console.log(user.status);
    await user.save();
    res.status(200).json({ status: user.status });
});


const updateUser = asyncHandler(async (req, res) => {
    const roles = ['customer', 'technician', 'organization'];
    if (!roles.includes(req.body.role)) {
        res.status(400).json({ message: 'Error: role must be one of ' + roles.join(', ') });
    } else {
        const id = req.body.id;
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'Error while searching for the user.' });
            return;
        }
        //console.log(user);
        // Validering har inte implementerats än
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.email = req.body.email;
        user.role = req.body.role;
        
        await user.save();
        res.status(200).json(user);     
    }   
});



const createPriceList = asyncHandler(async (req, res) => {
    // Created a price list for testing. Most values are defaults in the model and the
    // height prices are hardcoded. The actual implementation should receive all values  
    // from the request. 
    try {

        heightPrices = [
            {height:1.5, price:0},
            {height:1.0, price:0.01},
            {height:0.5, price:0.02}
        ];
        
        await PriceList.create({ 
            height_prices: heightPrices
        });
        res.status(200).json({message: 'Price list created successfully.'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Error while creating price list.'});
    }
});


module.exports = {createPriceList, getUsers, getUser, toggleUserStatus, updateUser};