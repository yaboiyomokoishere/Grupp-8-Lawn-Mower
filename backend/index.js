const express = require ('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require("./Middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');
const Sla = require("./Models/slaModel");

connectDb();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true, // To allow cookies
    origin: 'http://localhost:5173' // Allow requests from this origin
    }
)); // Currently allowing all origins, to be changed later

app.use("/api/user", require("./Routes/userRoutes"));
app.use("/api/sla", require("./Routes/slaRoutes"));
app.use("/api/robot", require("./Routes/robotRoutes"));
app.use(errorHandler);

//setInterval(()=> {
  //  console.log("test");
//}, 1000);

async function test(data) {
    const result = await Sla.findOne({_id: '6792527c187052508165cba8'});
    console.log(result);
    return result
}

const job = schedule.scheduleJob(' 55 * * * *', async() => {
    const result = await test();
    console.log(result);
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});