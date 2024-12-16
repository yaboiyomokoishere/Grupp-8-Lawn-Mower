const express = require ('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require("./Middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require('cors');

connectDb();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/user", require("./Routes/userRoutes"));
app.use(errorHandler);

 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


