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

const router = useRouter();


const orderDetails = reactive({
address: '',
start_date: '',
end_date: '',
grass_height: 0,
working_area: 0,
total_price: 0
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
        const response = await apiClient.post('/sla/createSla', orderDetails);
        console.log('Order confirmed:', response.data);
        localStorage.removeItem('newOrder');
        router.push({ name: 'customer_contracts' });
    } catch (error) {
        console.error('Error confirming order:', error);
    }
};

const cancelOrder = () => {
localStorage.removeItem('newOrder');
router.push({ name: 'order_contract' });
};


onMounted(async () => {

const newOrderData = JSON.parse(localStorage.getItem('newOrder'));

if (!newOrderData) {
    console.error('form has not been filled');
    router.push({ name: 'order_contract' });
    return;
}

// Order data from the form filled by the user
orderDetails.address = newOrderData.address;
orderDetails.start_date = newOrderData.start_date ;
orderDetails.end_date = newOrderData.end_date;
orderDetails.grass_height = newOrderData.grass_height;
orderDetails.working_area = newOrderData.working_area;

try {
    const response = await apiClient.post('/sla/getPrice', newOrderData);
    console.log("Total price:", response.data.result);
    orderDetails.total_price = response.data.result;
    console.log(orderDetails)
} catch (error) {
    console.error('Error fetching total price:', error);
}

try {
    const response = await apiClient.get('/user/getCustomer');
    console.log("User data", response.data);
    customerInfo.first_name = response.data.first_name;
    customerInfo.last_name = response.data.last_name;
    customerInfo.email = response.data.email;
    customerInfo.phone_number = response.data.customer_details.phone_number;
    customerInfo.address = response.data.customer_details.address;
} catch (error) {
    console.error('Error fetching total price:', error);
}
});
</script>
  
<style scoped>
.confirmation-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.customer-info, .sla-info, .price-info {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

h2 {
    margin-bottom: 10px;    
}

h3 {
    color: #333;
}

p {
    margin: 5px 0;
}

.action-buttons {
    display: flex;
    justify-content: space-between;
}

.confirm-button, .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.confirm-button {
    background-color: #28a745;
    color: #fff;
}

.cancel-button {
    background-color: #dc3545;
    color: #fff;
}

.confirm-button:hover {
    background-color: #218838;
}

.cancel-button:hover {
    background-color: #c82333;
}
</style>
  