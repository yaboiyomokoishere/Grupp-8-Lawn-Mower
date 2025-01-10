const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");



// const getCustomerInfo = asyncHandler(async (req,res) => {
//     const {id} = req.user;
//     const user = await User.findById(id).select("-password"); 
    
//     if (user) {
//         res.status(200).json(user);
//     } else {
//         res.status(404);
//         throw new Error("Error: user not found");
//     }
// });

const getCustomerSlas = asyncHandler(async (req,res) => {
    const user = await getUser(req);
    const contracts = user.customer_details.contracts;
    const contractList = [];
    if (contracts) {
        for (const id of contracts) {
            const contract = await User.findById(id).select("type address start_date end_date status");
            contractList.push({
                id: contract._id,
                type: contract.type,
                address: contract.address,
                start_date: contract.start_date,
                end_date: contract.end_date,
                status: contract.status
            });
        }
    } 
    res.status(200).json(contractList);
});

const getUser = asyncHandler(async (req) => {
    const {id} = req.user;
    const user = await User.findById(id).select("-password"); 
    if(!user){
        throw new Error("User not found");
    }
    return user;
})

module.exports = {getCustomerSlas, getUser};