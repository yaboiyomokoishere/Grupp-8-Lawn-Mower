<template>
    <div class="confirmation-page">
        <div class="customer-info">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> {{ customerInfo.first_name }} {{ customerInfo.last_name }}</p>
            <p><strong>Email:</strong> {{ customerInfo.email }}</p>
            <p><strong>Phone:</strong> {{ customerInfo.phone_number }}</p>
            <p><strong>Address:</strong> {{ customerInfo.address }}</p>
        </div>

        <div class="sla-info">
            <h2>Service Level Agreement Details</h2>
            <p><strong>Service Address:</strong> {{ orderDetails.address }}</p>
            <p><strong>Start Date:</strong> {{ orderDetails.start_date }}</p>
            <p><strong>End Date:</strong> {{ orderDetails.end_date }}</p>
            <p><strong>Robot Model:</strong> {{ orderDetails.robot_model }}</p>
            <p><strong>Grass Height:</strong> {{ orderDetails.grass_height }} cm</p>
            <p><strong>Working Area:</strong> {{ orderDetails.working_area }} m²</p>
        </div>

        <div class="price-info">
            <h3>Total Price: {{ orderDetails.total_price }} kr</h3>
        </div>

        <div class="action-buttons">
            <button class="cancel-button" @click="cancelOrder">Cancel</button>
            <button class="confirm-button" @click="confirmOrder">Purchase</button>
        </div>
    </div>
</template>
  
<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/config/axios';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const orderDetails = reactive({
    address: '',
    start_date: '',
    end_date: '',
    grass_height: 0,
    working_area: 0,
    robot_model: '',
    total_price: 0,
});

const customerInfo= reactive({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: ''
})

const confirmOrder = async () => {
    try {
        console.log("Creating new order...");
        const response = await apiClient.post('/sla/createSla', orderDetails);
        if(response.status == 201){
            localStorage.removeItem('newOrder');
            toast.success('Order created successfully!');
            router.push({ name: 'customer_contracts' });
        }
    } catch (error) {
        console.error('Error confirming order:', error);
    }
};

const cancelOrder = () => {
    localStorage.removeItem('newOrder');
    router.push({ name: 'order_contract' });
};

const getNewOrderDetails = async () => {
    const newOrderData = JSON.parse(localStorage.getItem('newOrder'));

    if (!newOrderData) {
        console.error('form has not been filled');
        router.push({ name: 'order_contract' });
        return;
    }
    console.log('New order data: ', newOrderData);

    // Order data from the form filled by the user
    orderDetails.address = newOrderData.address;
    orderDetails.start_date = newOrderData.start_date ;
    orderDetails.end_date = newOrderData.end_date;
    orderDetails.grass_height = newOrderData.grass_height;
    orderDetails.working_area = newOrderData.working_area;
    orderDetails.robot_model = newOrderData.robot_model;

    try {
        // Append the create_sla variable to follow the price calculator documentation.
        newOrderData.create_sla = true;
        console.log("Order data: ", newOrderData)
        console.log("Calculating price...");
        const response = await apiClient.post('/sla/getPrice', newOrderData);
        orderDetails.total_price = Math.ceil(response.data.result);
        console.log("Price calculated: ", orderDetails.total_price);
        //console.log(orderDetails)
    } catch (error) {
        console.error('Error fetching total price:', error);
    }
}

const getCustomerInfo = async () => {
    try {
        console.log("Loading customer data...");
        const response = await apiClient.get('/user/getCustomer');
        //console.log("User data", response.data);
        customerInfo.first_name = response.data.first_name;
        customerInfo.last_name = response.data.last_name;
        customerInfo.email = response.data.email;
        customerInfo.phone_number = response.data.customer_details.phone_number;
        customerInfo.address = response.data.customer_details.address;
        console.log("Customer data loaded!");
    } catch (error) {
        console.error('Error fetching total price:', error);
    }
}

onMounted(async () => {
    await getNewOrderDetails();
    await getCustomerInfo();
});
</script>
  
<style scoped>
.confirmation-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column; /* Display items in a column format instead of row format */
    align-items: center; /* Center items horizontally */
    padding: 1rem;
    background-color: #f5f5f5;
}

.customer-info, .sla-info, .price-info {
    width: 100%;
    max-width: 400px;
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 3px 3px rgba(128, 128, 128, 0.485);
}

.price-info {
    text-align: center;
}

h2 {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5rem;
}

h3 {
    font-size: 1.25rem;
    color: #2d3748;
    margin: 0;
}

p {
    margin: 0.75rem 0;
    color: #4a5568;
}

strong {
    color: #2d3748;
    min-width: 120px;
    display: inline-block;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    max-width: 440px;
    gap: 15px;
}

button {
    font-size: 1rem;
    text-decoration: none;
    padding: 10px 15px;
    border-radius: 5px;
    border: 2px solid black;
}

.cancel-button:hover{
    background-color: white;
    color:red;
}
.confirm-button:hover{
    background-color: white;
    color:green;
}
</style>