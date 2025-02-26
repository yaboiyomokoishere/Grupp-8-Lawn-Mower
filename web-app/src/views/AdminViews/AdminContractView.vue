<template>
    <div class="user-page-container">
        <AdminNavBar />
        <div class="customer-content">
            <h1>Service Level Agreement</h1>

            <div class="back-button-container">
                <RouterLink  class="back-button">
                    <button @click="$router.back()">Go back</button>
                </RouterLink>
            </div>
            
            <div class="sla-view">
                <div class="action-buttons">
                    <RouterLink :to="{name: 'update_as_customer',  params: {id: slaDetails.id} }" 
                    v-if="validStatuses.includes(slaDetails.status)">
                            <button class="sla-button">Update as Customer</button>
                    </RouterLink>
    
                    <button class="sla-button" @click = "cancelOrder" v-if="validStatuses.includes(slaDetails.status)">
                        Cancel
                    </button>

                    <RouterLink :to="{name: 'customer_Log_view',  params: {id: slaDetails.id} }">
                        <button class="sla-button">View Log</button>
                    </RouterLink>
                    <RouterLink :to="{name: 'customer_contract_report',  params: {id: slaDetails.id} }">
                        <button class="sla-button">Report Error</button>
                    </RouterLink>
                </div>
                
                <div class="status">
                    <form @submit.prevent="updateStatus" class="status-form">
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
                    <form @submit.prevent="updateServiceDetails" class="service-details-form">
                        <div class="form-row">
                            <label for="address"><strong>Service Address:</strong></label>
                            <input id="address" v-model="slaDetails.address" type="text">
                        </div>
                        <div class="form-row">
                            <label for="start-date"><strong>Start Date:</strong></label>
                            <input id="start-date" v-model="slaDetails.start_date" type="date">
                        </div>
                        <div class="form-row">
                            <label for="end-date"><strong>End Date:</strong></label>
                            <input id="end-date" v-model="slaDetails.end_date" type="date">
                        </div>
                        <div class="form-row">
                            <label for="grass-height"><strong>Grass Height (cm):</strong></label>
                            <select v-model="slaDetails.grass_height" name="grass_height" id="grass_height" required>
                                <option :value="slaDetails.grass_height">{{ slaDetails.grass_height }}</option>
                                <option v-for="heightObj in availableHeights.filter((h) => h.height != slaDetails.grass_height)">
                                    {{ heightObj.height }}
                                </option>
                            </select>
                        </div>
                        <div class="form-row">
                            <label for="working-area"><strong>Working Area (m²):</strong></label>
                            <input id="working-area" v-model="slaDetails.working_area" type="number" :min="slaDetails.current_cut_area" max="5000">
                        </div>
                        <div class="form-row">
                            <label for="current-cut-area"><strong>Current cut area (m²):</strong></label>
                            <input id="current-cut-area" v-model="slaDetails.current_cut_area" type="number">
                        </div>
                        <div class="form-row">
                            <label for="price"><strong>Total price (kr):</strong></label>
                            <input id="price" v-model="slaDetails.price" type="number">
                        </div>
                        <button type="submit" class="update-service-details-button">Update Service Details</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import  apiClient from '@/config/axios';
import AdminNavBar from '@/components/AdminNavBar.vue';

const $route = useRoute();
const router = useRouter();
const validStatuses = ['Active', 'Paid', 'Pending', 'Completed', 'Fault', 'Cancelled'];
const availableHeights = ref([]);


const slaDetails = reactive({
    address: '',
    start_date: '',
    creation_date: '',
    end_date: '',
    grass_height: 0,
    working_area: 0,
    status: '',
    price: 0,
    current_cut_area: 0
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
            router.go();
        }
        
    } catch (error) {
        console.error('Error cancelling order:', error);
    }
};

const updateStatus = async() => {
    try {
        const args = {
            id: $route.params.id,
            status: slaDetails.status
        }

        const response = await apiClient.put('/user/updateSlaStatus', args);
        //console.log(response)
        if(response.status == 200){
            console.log("Status updated successfully");
            router.go();
            return;
        }
        console.log("Something went wrong while updating the status.")
    } catch (error) {
        console.log('Error: ', error);
    }
}

const updateServiceDetails = async () => {
    //console.log(slaDetails)
    try {
        const id = {id: $route.params.id}
        const response = await apiClient.put('/user/updateServiceDetails', {slaDetails, id});
        //console.log(response)
        if(response.status == 200){
            console.log("Status updated successfully");
            router.go();
            return;
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

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
        slaDetails.current_cut_area = response.data.result.current_cut_area;
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
    console.log(slaDetails.grass_height)
    const slaPriceList = await apiClient.get(`/sla/getSlaPriceList?id=${ $route.params.id }`);
    availableHeights.value.push(...slaPriceList.data.height_prices);
});    
</script>

<style scoped>
.sla-view {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.customer-info, .sla-view,  .service-details-form, .status {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.service-details-form {
    height: 300px;
}

.form-row {
    display: flex;
    margin-bottom:5px;
}

.form-row label {
    flex: 1; 
}

.form-row input {
    flex: 1; 
    max-width: 150px;
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

.status-form {
    display: flex;
    gap: 10px;
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

.status-form button, .update-service-details-button, input, .status-form input {
    font-size: 0.9rem;
    padding: 5px;
}
</style>