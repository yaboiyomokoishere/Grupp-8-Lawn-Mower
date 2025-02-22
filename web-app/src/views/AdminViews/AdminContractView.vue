<template>
    <div class="user-page-container">
        <AdminNavBar />
        <div class="customer-content">
            <h1>Service Level Agreement</h1>

            <div class="sla-view">
                <div class="action-buttons">
                    <RouterLink :to="{name: 'customer_update_contract',  params: {id: slaDetails.id} }" 
                    v-if="validStatuses.includes(slaDetails.status)">
                            <button class="sla-button">Update as Customer</button>
                    </RouterLink>
    
                    <button class="sla-button" @click = "cancelOrder" v-if="validStatuses.includes(slaDetails.status)">
                        Cancel
                    </button>

                    <RouterLink :to="{name: 'customer_Log_view',  params: {id: slaDetails.id} }">
                        <button class="sla-button">View Log</button>
                    </RouterLink>
                </div>
                
                <div class="status">
                    <form @submit.prevent="updateStatus">
                        <p>Status: 
                            <select v-model="slaDetails.status">
                                <option v-for="status in validStatuses" :key="status" :value="status">{{ status }}</option>
                            </select>
                        </p>
                        <button type="submit" class="sla-button">Update Status</button>
                    </form>
                    <p>Created on  {{ slaDetails.creation_date }}</p>
                </div>

                <div class="sla-info">
                    <h2>Customer Information</h2>
                    <div class="customer-info">
                        <p><strong>Name:</strong> {{ customerInfo.first_name }} {{ customerInfo.last_name }}</p>
                        <p><strong>Email:</strong> {{ customerInfo.email }}</p>
                        <p><strong>Phone:</strong> {{ customerInfo.phone_number }}</p>
                        <p><strong>Address:</strong> {{ customerInfo.address }}</p>
                    </div>
                    
                    <h2>Service Details</h2>
                    <form @submit.prevent="updateServiceDetails">
                        <div class="service-details">
                            <p><strong>Service Address:</strong> <input v-model="slaDetails.address" type="text"></p>
                            <p><strong>Start Date:</strong> <input v-model="slaDetails.start_date" type="date"></p>
                            <p><strong>End Date:</strong> <input v-model="slaDetails.end_date" type="date"></p>
                            <p><strong>Grass Height:</strong> <input v-model="slaDetails.grass_height" type="number"> cm</p>
                            <p><strong>Working Area:</strong> <input v-model="slaDetails.working_area" type="number"> m²</p>
                        </div>
                        <button type="submit" class="sla-button">Update Service Details</button>
                    </form>
                    <p class="total-price">Total Price: {{ slaDetails.price }} kr</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import  apiClient from '@/config/axios';
import AdminNavBar from '@/components/AdminNavBar.vue';


const $route = useRoute();
const validStatuses = ['Active', 'Paid', 'Pending', 'Completed'];

const slaDetails = reactive({
    address: '',
    start_date: '',
    creation_date: '',
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
});


const cancelOrder = async () => {
    try {
        const id = {id: $route.params.id}
    
        const response = await apiClient.post('/sla/cancelSla', id);
        if(response.status == 200){
            console.log(response.data.message);
            //toast.success("Cancelled order successfully!");
            window.location.reload();
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
    }
};

const fetchSla = async () => {
    try {
        const id = $route.params.id
        //console.log(id);
        const response = await apiClient.get(`/sla/getSla?id=${id}`); 
        console.log('AdminContract - fetchSla: ', response.data.result);
    
        slaDetails.address = response.data.result.address;
        slaDetails.start_date = response.data.result.start_date.split('T')[0];
        slaDetails.end_date = response.data.result.end_date.split('T')[0];
        slaDetails.creation_date = response.data.result.createdAt.split('T')[0];
        slaDetails.grass_height = response.data.result.grass_height;
        slaDetails.working_area = response.data.result.working_area;
        slaDetails.status = response.data.result.status;
        slaDetails.price = Math.round(response.data.result.price);
    } catch (error) {
        console.log(error);
    }
};

const fetchUser = async() => {
    try {
        const customerId =  $route.params.customerId;
        const response = await apiClient.get('/user/getUser?id=' + customerId);
        console.log("AdminContract - fetchUser: ", response.data);
        customerInfo.first_name = response.data.first_name;
        customerInfo.last_name = response.data.last_name;
        customerInfo.email = response.data.email;
        customerInfo.phone_number = response.data.customer_details.phone_number;
        customerInfo.address = response.data.customer_details.address;
    } catch (error) {
        console.error('Error fetching total price:', error);
    }
}

onMounted(async () => {
    await fetchSla();
    await fetchUser();
});    
</script>

<style scoped>
.sla-view {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.customer-info, .sla-view,  .service-details, .status {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}


.total-price {
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
}
.status {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;    
    text-align: right;
    font-weight: bold;
}

.customer-content{
    padding-top: 0;
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
