<template>
    <div class="user-page-container">
        <div v-if="role == 'admin'">
            <AdminNavBar />
        </div>
        <div v-else-if="role == 'customer'">
            <CustomerNavBar />
        </div>
        <div class="customer-content">
            <h1>Update Service Details</h1>
            <div class="update-service-form">
                <div class="current-details">
                    <p>Current Cut Area: {{ currentCutArea }} m²</p>
                    <p>Max Area: {{ maxArea }} m²</p>
                </div>

                <form @submit.prevent="handleSubmit">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="grassHeight">Grass Height (cm):</label>
                            <select name="grass_height" id="grass_height" v-model="formData.grass_height" required>
                                <option v-for="heightObj in availableHeights" :value="heightObj.height">
                                    {{ heightObj.height }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="workingArea">Working Area (m²):</label>
                            <input 
                                id="workingArea"
                                type="number"
                                v-model="formData.working_area"
                                required
                                :min="currentCutArea"
                                :max="maxArea"
                            />
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button v-if="formData.price" type="submit">Confirm</button>
                        <button type="button"  @click = "calculateNewTotalPrice">Calculate</button>
                        <button type="button"  @click="goBack">Cancel</button>
                    </div>
                    <br>
                    <p v-if="formData.price">Your changes will cost {{ formData.price }} kr. </p>
                </form>
            </div>
        </div>
    </div>

</template>
  
<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '@/config/axios';
import CustomerNavBar from '@/components/CustomerNavBar.vue';
import AdminNavBar from '@/components/AdminNavBar.vue';
import router from '@/router';
import { jwtDecode } from 'jwt-decode';

const route = useRoute();
const toast = useToast();
const role = ref('');

const formData = reactive({
    grass_height: route.params.grass_height,
    working_area: route.params.working_area,
    start_date: null,
    end_date: null,
    robot_model: null,
    id: route.params.id,
    price: ''
});

const currentCutArea = ref(0);
const maxArea = ref(0);
// Current contract values to prevent unneccesary api clients -> validation. 
const currentWorkingArea = ref(0);
const currentGrassHeight = ref(0);

const availableHeights = ref([]);


function goBack() {
    router.push({ name: 'customer_contract_view' });
}

async function calculateNewTotalPrice() {
    // Check that atleast one field is being updated.
    if (currentWorkingArea.value == formData.working_area && currentGrassHeight.value == formData.grass_height){
        alert("Must update a value before calculating a new price.");
    } 

    const slaData = {
        id: formData.id,
        grass_height: formData.grass_height,
        working_area: formData.working_area,
        start_date: formData.start_date,
        end_date: formData.end_date,
        robot_model: formData.robot_model
    }
    try {
        const response = await apiClient.post('/sla/getPrice', slaData);
        console.log(response.data.result);
        formData.price = response.data.result;
        // Price NAN WHEN EDITING THE WORKING AREA, WHY???    
    } catch (error) {
        console.log(error)
    }
}

async function handleSubmit() {
    try {
        const id = formData.id
        const slaData = {
            id: id,
            grass_height: formData.grass_height,
            working_area: formData.working_area,
            start_date: route.params.start_date,
            end_date: route.params.end_date,
            update_cost: formData.price
        }
        const response = await apiClient.put('/sla/updateSla', slaData);
        if (response.status === 200) {
            console.log('Sla updated!');
        }
        toast.success('Sla updated successfully!');
        router.push({ name: 'customer_contract_view' });       
    } catch (error) {
        console.error('Error updating SLA:', error);
    }
}

const fetchSlaData = async () => {
    try {
        const id = route.params.id
        const response = await apiClient.get(`/sla/getSla?id=${id}`); 
        formData.grass_height = response.data.result.grass_height;
        formData.working_area = response.data.result.working_area;
        formData.start_date = response.data.result.start_date;
        formData.end_date = response.data.result.end_date;
        formData.robot_model = response.data.result.assigned_robot_model;
        console.log(formData)

        currentCutArea.value = response.data.result.current_cut_area;
        currentWorkingArea.value = response.data.result.working_area;
        currentGrassHeight.value =response.data.result.grass_height; 
    } catch (err){
        console.log("Error while fetching the sla: ", err);
    }
}


onMounted(async () => {
    try {
        await fetchSlaData();

        const slaPriceList = await apiClient.get(`/sla/getSlaPriceList?id=${ route.params.id }`);
        maxArea.value = slaPriceList.data.max_area;
        // Extract the height-price objects as elements.
        availableHeights.value.push(...slaPriceList.data.height_prices);

        // Determine the user for the correct navbar.
        const token = localStorage.getItem('accessToken');
        if(token){
            const decodedToken = jwtDecode(token);
            console.log('Accessing the page as ' + decodedToken.user.role);
            if(['admin', 'customer'].includes(decodedToken.user.role)){
                role.value = decodedToken.user.role;
            }
        }
    } catch (error) {
        console.log(error);
    }
})
</script>
  
<style scoped>
.update-service-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size:1.2rem;
}
.current-details {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
}
.form-row {
    display: flex;
    gap: 20px;
}
form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

label {
    font-weight: bold;
}

input, option, select {
    margin: 30px;
    font-size: 1.2rem;
    padding: 10px;
    box-sizing: border-box;
    width: 100px
}

input, label, option, select {
  display: block;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
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
