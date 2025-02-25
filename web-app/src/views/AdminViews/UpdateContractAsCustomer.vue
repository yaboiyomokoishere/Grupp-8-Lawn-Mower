<template>
    <div class="user-page-container">
        <CustomerNavBar />
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
                            <select v-model="formData.grass_height" name="grass_height" id="grass_height" required>
                                <option :value="formData.grass_height">{{ formData.grass_height }}</option>
                                <option v-for="heightObj in availableHeights.filter((h) => h.height != formData.grass_height)">
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
                        <button v-else type="button"  @click = "calculateNewTotalPrice">Calculate</button>
                        <button type="button"  @click="goBack">Cancel</button>
                    </div>
                    <br>
                    <p v-if="formData.price">Your changes will cost {{ updateCost }} kr. </p>
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
import router from '@/router';

const route = useRoute();
const toast = useToast();

const formData = reactive({
    grass_height: route.params.grass_height,
    working_area: route.params.working_area,
    id: route.params.id,
    price: ''
});

const currentCutArea = ref(0);
const maxArea = ref(0);
const workingArea = ref(0);

const updateCost = ref(0);
const availableHeights = ref([]);


function goBack() {
    router.push({ name: 'update_as_customer' });
}

async function calculateNewTotalPrice() {
    try {
        const id = formData.id
        const sla = await apiClient.get(`/sla/getSla?id=${id}`);
        console.log(sla);
        if (sla.status === 200) {
            console.log('Sla data returned!');
        } else {
            console.log('Error while fetching the SLA.')
        }
        // Check if the changes are realistic, i.e.,  the service new working area cannot be less than 
        // what's already been completed.
        if(currentCutArea.value > formData.working_area || formData.working_area > maxArea.value){
            alert('Invalid operations: Cannot reduce below the current cut area.')
            return;
        }

        let newAreaPrice = workingArea.value > formData.working_area
                            ? workingArea.value - formData.working_area - currentCutArea.value
                            :formData.working_area - workingArea.value - currentCutArea.value;
        //console.log(sla.data.result);
        const slaData = {
            id: id,
            grass_height: formData.grass_height,
            working_area: newAreaPrice,
            start_date: sla.data.result.start_date,
            end_date: sla.data.result.end_date,
            robot_model: sla.data.result.assigned_robot_model
        }

        const response = await apiClient.post('/sla/getPrice', slaData);
        response
        if(formData.working_area > workingArea.value){
            updateCost.value = response.data.result;
        } else if(formData.working_area < workingArea.value){
            updateCost.value = - response.data.result;
        }
        formData.price = updateCost.value;
        console.log(response.data.result);
    } catch (error) {
        console.error('Error updating SLA:', error);
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


onMounted(async () => {
    try {
        const id = route.params.id
        //console.log(id);
        const response = await apiClient.get(`/sla/getSla?id=${id}`); 
        formData.grass_height = response.data.result.grass_height;
        formData.working_area = response.data.result.working_area;
        currentCutArea.value = response.data.result.current_cut_area;
        workingArea.value = response.data.result.working_area;
        

        const slaPriceList = await apiClient.get(`/sla/getSlaPriceList?id=${id}`);
        maxArea.value = slaPriceList.data.max_area;
        //console.log(maxArea.value);
        //console.log(slaPriceList.data);
        // Extract the height-price objects as arrays
        availableHeights.value.push(...slaPriceList.data.height_prices);
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
