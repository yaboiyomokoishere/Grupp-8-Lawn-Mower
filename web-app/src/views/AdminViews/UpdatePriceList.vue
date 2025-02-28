<template>
    <div class="user-page-container">
        <AdminNavBar />
        <div class="admin-content">
            <h1>Edit Price List</h1>
            <div class="back-button-container">
                <button @click="router.go(-1)" >Go back</button>
            </div>
        
            <div class="form-container">
                <form @submit.prevent="handleSubmit">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Model Name</label>
                            <input v-model="formData.model" required/>
                        </div>

                        <div class="form-group">
                            <label>Installation (kr)</label>
                            <input v-model="formData.installation" type="number" required/>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Max Area (m²)</label>
                            <input v-model="formData.maxArea" type="number" required />
                        </div>

                        <div class="form-group">
                            <label>Price per m²</label>
                            <input v-model="formData.pricePerSquareMeter" type="number" min="0.01" step="0.01" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Daily Rent (kr)</label>
                        <input v-model="formData.dailyRent" type="number" min="1" step="0.5" required />
                    </div>

                    <h3 style="margin: 20px auto;">Height Prices</h3>
                    <div v-for="(heightPrice, index) in formData.heightPrices" :key="index" class="height-price-group">
                        <div class="form-group">
                            <label>Height</label>
                            <input v-model="heightPrice.height" type="number" min="0.1" step="0.1" required/>
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input v-model="heightPrice.price" type="number" min="0" step="0.01" required/>
                        </div>
                        <button type="button" @click="removeHeightPrice(index)" class="remove-pair">×</button>
                    </div>
                        
                    <button type="button" @click="addHeightPrice" class="add-button">Add Height/Price</button>

                    <div class="form-actions">
                        <button type="submit">Update</button>
                        <button type="button" @click="router.go(-1)">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/config/axios';
import AdminNavBar from '@/components/AdminNavBar.vue';


const route = useRoute();
const router = useRouter();
const formData = reactive({
    id:route.params.id,
    model: '',
    installation: 0,
    maxArea: 0,
    pricePerSquareMeter: 0,
    dailyRent: 0,
    heightPrices: []
});

const fetchPriceList = async () => {
    try {
        const response = await apiClient.get(`/user/getPriceList?id=${route.params.id}`);
        //console.log(response.data);
        formData.model = response.data.model;
        formData.installation = response.data.installation;
        formData.maxArea = response.data.max_area;
        formData.pricePerSquareMeter = response.data.price_per_square_meter;
        formData.dailyRent = response.data.robot_daily_rent;
        formData.heightPrices.push(...response.data.height_prices);
    } catch (error) {
        console.error('Error fetching price list:', error);
    }
};

const addHeightPrice = () => {
    formData.heightPrices.push({ height: 0, price: 0 });
};

const removeHeightPrice = (index) => {
    if (formData.heightPrices.length > 1) {
        formData.heightPrices.splice(index, 1);
    }
};

const handleSubmit = async () => {
    try {
        const response = await apiClient.put('/user/updatePriceList', formData);
        if (response.status === 200) {
           console.log("Success")
        }
    } catch (error) {
        console.error('Update error:', error);
        toast.error('Failed to update price list');
    }
};

onMounted(async () => {
    await fetchPriceList();
});
</script>

<style scoped>
.height-price-group {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

.remove-pair {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    padding: 0;
    height: fit-content;
}

.add-button {
    margin: 1rem 0;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.form-container {
    max-width: 800px;
    margin: 0 auto;
}

.form-group {
    flex: 1;
}

button {
    font-size: 1rem;
    float:right;
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