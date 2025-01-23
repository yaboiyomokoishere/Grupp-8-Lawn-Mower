<template>
    <div class="user-page-container">
        <CustomerNavBar />
        <div class="customer-content">
                <div class="action-buttons">
                    <button class="cancel-button" @click="cancelOrder">Update</button>
                    <button class="confirm-button" @click="confirmOrder">Cancel</button>
                    <button class="confirm-button" @click="confirmOrder">View Log</button>
                </div>

            <div class="confirmation-page">
            <div class="customer-info">
                <h2>Customer Information</h2>
                <!-- <p><strong>Name:</strong> {{ slaDetails.customerName }}</p>
                <p><strong>Email:</strong> {{ slaDetails.customerEmail }}</p>
                <p><strong>Phone:</strong> {{ slaDetails.customerPhone }}</p>
                <p><strong>Address:</strong> {{ slaDetails.customerAddress }}</p> -->

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
    price: 0
});
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
  