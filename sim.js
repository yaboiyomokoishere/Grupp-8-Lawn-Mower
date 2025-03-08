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

const sla = ['67cc4a84efb97dcf7b18097', '67cc4ae6efb97dcf7b1809ab'] //sla id here
 
const robot = ['1', '8'] // robot serial number

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
        if(i  == 1) {
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