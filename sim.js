const axios = require('axios');
const dateCheck = require('./backend/Middleware/dateCheck');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const userData = { // user data here
    "firstName": "axios",
    "lastName": "test",
    "email": "axios@test.se",
    "address": "gatan",
    "phone": "12345",
    "postalCode": "12345",
    "password": "testtest"
};

const sla = ['67c32d94a35241ffadd640a0', '67c332f6bbdd34a9933181ac', '67c33315e99a4a096e249201', '67c33324e99a4a096e249212'] //sla id here

const robot = ['7', '12', '13', '14'] // robot serial number

const sim = async (userData, sla, robot) => {
    
    //await register(userData);
    // const token = await login(userData);
    // const apiClient = axios.create({
    //     headers: {
    //         'Authorization': `Bearer ${token.accessToken}`
    //     }
    // });

    for (let i = 0; i < sla.length; i++) {
        console.log(sla[i]);
        console.log(robot[i]);
        if(i % 2 == 0) {
            await startCutting(sla[i]);
            await sleep(5000);
            await currentCutArea(sla[i]);
            await sleep(5000);
            await doneCutting(sla[i]);
            await sleep(5000);
        } else {
            await startCutting(sla[i]);
            await sleep(5000);
            await currentCutArea(sla[i]);
            await sleep(5000);
            await broken(robot[i]);
            await sleep(5000);
        }
    }
    // dateCheck();
};

const register = async (data) => {
    try {
        const response = await axios.post('http://localhost:3001/api/user/register', data);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

const login = async (data) => {
    try {
        const response = await axios.post('http://localhost:3001/api/user/login', data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const startCutting = async (sla) => {
    try {
        const response = await axios.post('http://localhost:3001/api/robot/startCutting', {'sla_id': sla});
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

const currentCutArea = async (sla) => {
    try {
        const currentCutArea = Math.floor(Math.random() * 100);
        const response = await axios.post('http://localhost:3001/api/robot/currentCutArea', {'sla_id': sla, 'currentCutArea': currentCutArea});
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

const doneCutting = async (sla) => {
    try {
        const response = await axios.post('http://localhost:3001/api/robot/doneCutting', {'sla_id': sla});
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

const broken = async (serial_number) => {
    try {
        const response = await axios.post('http://localhost:3001/api/robot/broken', {'serial_number': serial_number});
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

sim(userData, sla, robot);