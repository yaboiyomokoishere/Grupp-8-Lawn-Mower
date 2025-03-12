const express = require ('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require("./Middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');
const dateCheck = require('./Middleware/dateCheck');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/user", require("./Routes/userRoutes"));
app.use("/api/sla", require("./Routes/slaRoutes"));
app.use("/api/robot", require("./Routes/robotRoutes"));
app.use(errorHandler);


// Run every day at 02:00
const job = schedule.scheduleJob('* * 2 * * *', async() => {
    await dateCheck();
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});