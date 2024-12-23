const express = require ('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require("./Middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

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
app.use(errorHandler);

 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});