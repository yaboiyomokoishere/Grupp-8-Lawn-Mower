<template>
    <div class="user-page-container">
        <CustomerNavBar />
        <div class="customer-content">
            <div class="action-buttons">
                <button class="sla-button" @click="cancelOrder">Update</button>
                <button class="sla-button" @click="confirmOrder">Cancel</button>
                <button class="sla-button" @click="confirmOrder">View Log</button>
                <button class="sla-button" @click="confirmOrder">Report</button>
            </div>

            <div class="sla-view">
                <h1>Service Level Agreement</h1>
                <h2>Status: {{ slaDetails.status }}</h2>
                <div class="sla-info">
                    <h2>Customer Information</h2>
                    <p><strong>Name:</strong> {{ customerInfo.first_name }} {{ customerInfo.last_name }}</p>
                    <p><strong>Email:</strong> {{ customerInfo.email }}</p>
                    <p><strong>Phone:</strong> {{ customerInfo.phone_number }}</p>
                    <p><strong>Address:</strong> {{ customerInfo.address }}</p>

                    <h2>Service Level Agreement Details</h2>
                    <p><strong>Service Address:</strong> {{ slaDetails.address }}</p>
                    <p><strong>Start Date:</strong> {{ slaDetails.start_date }}</p>
                    <p><strong>End Date:</strong> {{ slaDetails.end_date }}</p>
                    <p><strong>Grass Height:</strong> {{ slaDetails.grass_height }} cm</p>
                    <p><strong>Working Area:</strong> {{ slaDetails.working_area }} m²</p>

                    <p>Total Price: {{ slaDetails.price }} kr</p>
                </div>
        </div>
        </div>
        
    </div>
</template>


<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import  apiClient from '@/config/axios';
import CustomerNavBar from '@/components/CustomerNavBar.vue';

const $route = useRoute();
const slaDetails = reactive({
    address: '',
    start_date: '',
    end_date: '',
    grass_height: 0,
    working_area: 0,
    status: '',
    price: 0,

});

const customerInfo= reactive({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: ''
})

onMounted(async () => {
    try {
        const id = $route.params.id
        console.log(id);
        const response = await apiClient.get(`/sla/getSla?id=${id}`); 
        console.log(response.data.result);
        
        slaDetails.address = response.data.result.address;
        slaDetails.start_date = response.data.result.start_date.split('T')[0];
        slaDetails.end_date = response.data.result.end_date.split('T')[0];
        slaDetails.grass_height = response.data.result.grass_height;
        slaDetails.working_area = response.data.result.working_area;
        slaDetails.status = response.data.result.status;
        slaDetails.price = response.data.result.price;

    } catch (error) {
        console.log(error);
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
.sla-view {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.customer-info, .sla-info {
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
    justify-content: flex-end;
    gap: 15px;
}

.confirm-button, .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button {
    font-size: 1rem;
    text-decoration: none;
    padding: 10px 15px;
    border-radius: 5px;
    border: 2px solid black;
}

button:hover{
    background-color: #989d8f;
    color:black;
}
</style>
  