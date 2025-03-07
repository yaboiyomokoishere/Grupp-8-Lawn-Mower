<template>
    <div class="user-page-container">
        <AdminNavBar />
        <div class = "admin-content">
            <h1>Price Lists</h1>
            <div class="back-button-container" style="margin-bottom: 100px;">
                <button @click="showForm"  style="margin-right: 20px;">Create Price List</button>
            </div>

            <div v-if="showCreateForm" class="create-form-container">
                <h2>Create New Price List</h2>
                <form @submit.prevent="createPriceList" class="create-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Model Name:</label>
                            <input v-model="newPriceList.model" required/>
                        </div>
                        <div class="form-group">
                            <label>Installation (kr):</label>
                            <input v-model="newPriceList.installation" type="number" required/>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Max Area (m²):</label>
                            <input v-model="newPriceList.maxArea" type="number" required />
                        </div>
                        <div class="form-group">
                            <label>Price per m²:</label>
                            <input v-model="newPriceList.pricePerSquareMeter" type="number" min="0.01" step="0.01" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Daily Rent (kr):</label>
                        <input v-model="newPriceList.dailyRent" type="number" min="1" step="0.5" required />
                    </div>
                    
                    <h3 style="margin: 10px auto;">Height Prices</h3>
                    <div>
                        <div v-for="(heightPrice, index) in newPriceList.heightPrices" :key="index" class="height-price-group">
                            <div>
                                <label>Height</label>
                                <input v-model="heightPrice.height" type="number" min="0.1" step="0.1" placeholder="Height" required/>
                            </div>
                            <div>
                                <label>Price</label>
                                <input v-model="heightPrice.price" type="number" min="0" step="0.01" placeholder="Price" required/>
                            </div>
                            <button type="button" @click="removeHeightPrice(index)" class="remove-pair">×</button>
                        </div>
                        
                        <div class="add-button">
                            <button type="button" @click="addHeightPrice">Add Height/Price</button>
                        </div>
                        <br><br>
                        <div class="form-actions">
                            <button type="submit">Create Price List</button>
                            <button type="button" @click="hideForm">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
                    
            <table v-if= "priceLists.length" >
                <thead>
                    <tr>
                        <th>Model</th>
                        <th>Last Updated</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody v-for="priceList in priceLists" :key="priceList._id">
                    <tr >
                        <td><p>{{ priceList.model }}</p></td>
                        <td><p>{{ priceList.updatedAt.split('T')[0] }}</p></td>
                        <td> 
                            <button @click="togglePriceList(priceList._id)" style="margin-left: 20px;">Show</button> 
                            <RouterLink :to="{name:'admin_price_lists_update', params:{id:priceList._id}}">
                                <button >Edit</button>
                            </RouterLink>
                        </td>
                    </tr>
                    <tr v-if="priceListIds.has(priceList._id)">
                        <td colspan="3" class="price-list-details">
                            <div style="display: flex; gap: 15px;">
                                <div>
                                    <p><strong>Installation:</strong></p>
                                    <p>{{ priceList.installation }} kr</p>
                                </div>
                                <div>
                                    <p><strong>Max Area:</strong></p>
                                    <p> {{ priceList.max_area }} m²</p>
                                </div>
                                <div>
                                    <p><strong>Price per m²:</strong></p>
                                    <p> {{ priceList.price_per_square_meter }} kr</p>
                                </div>
                                <div>
                                    <p><strong>Daily Rent:</strong></p>
                                    <p> {{ priceList.robot_daily_rent }} kr</p>
                                </div>
                                <div>
                                    <p><strong>Height Prices</strong></p>
                                    <ul style="margin-left:20px;">
                                        <li v-for="(hp, index) in priceList.height_prices" :key="index">
                                            {{ hp.height }}m: {{ hp.price }} kr
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else>
                <p>No price list was found.</p>
            </div>      
        </div>
    </div>
</template>


<script setup>
import AdminNavBar from '@/components/AdminNavBar.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/config/axios';
import { reactive } from 'vue';


const router = useRouter();
const priceLists = ref([]);
const showCreateForm = ref(false);
const priceListIds = ref(new Set());
const newPriceList = reactive({
    model:'',
    heightPrices: [
        {height:0, price:0}
    ],
    maxArea: 0, 
    pricePerSquareMeter: 0, 
    installation: 0, 
    dailyRent: 0
})


const fetchPriceLists = async() => {
    try {
        const response = await apiClient.get('/user/getPriceLists');
        if(response.status == 200){
            priceLists.value.push(...response.data);
            console.log("Price lists returned successfully. Data: ", priceLists.value);
        } else {
            console.log('Error while fetching the price lists.')
        }
    } catch (error) {
        console.error('Error fetching price lists: ', error);
    }
}

const createPriceList = async () =>{
    try {
        const response = await apiClient.post('/user/createPriceList', newPriceList);
        if(response.status == 200){
            console.log("Price lists created successfully.");
            router.go();
        } else {
            console.log('Error while creating the price lists.');
        }
    } catch (error) {
        console.error('Error while creating a new price list: ', error);
    }
}

const addHeightPrice = () => {
    newPriceList.heightPrices.push({ height: 0, price: 0 });
};

const removeHeightPrice = (index) => {
    if (index != 0 && newPriceList.heightPrices.length > 1) { 
        newPriceList.heightPrices.splice(index, 1); // Delete one element at the respective index.
        console.log("Row removed.")
    } else {
        console.log("Must have at least one height/price row.")
    }
};

const showForm = () => {
    showCreateForm.value = true;
}

const hideForm = () => {
    showCreateForm.value = false;
    newPriceList.model = '';
    newPriceList.heightPrices = [{ height: 0, price: 0 }];
    newPriceList.maxArea = 0;
    newPriceList.pricePerSquareMeter = 0;
    newPriceList.installation = 0;
    newPriceList.dailyRent = 0;
};

const togglePriceList = (priceListId) => {
    const newSet = new Set(priceListIds.value);
    if (newSet.has(priceListId)) {
        newSet.delete(priceListId);
    } else {
        newSet.add(priceListId);
    }
    priceListIds.value = newSet;
};

onMounted(async ()=> {
    await fetchPriceLists();
});
</script>


<style scoped>
.create-form-container {
    max-width: 600px;
    margin: 2rem auto;
}

.create-form {
    min-height: 350px;
    height: auto;
    padding: 20px;
    border: 3px solid #CCCCCC;
}

.create-button {
    margin-left: auto;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

button, input {
    font-size: 0.9rem;
    padding: 10px;
}

.height-price-group {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
}

.admin-content table {
    width: 75%;
    max-width: 75%;
    margin: 0 auto;
    border-collapse: collapse; 
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.admin-content th, .admin-content td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.admin-content th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #2d3748;
}

.admin-content tr:hover {
    background-color: #f8fafc;
}

.admin-content p {
    color: #718096;
    margin-top: 1rem;
    font-style: italic;
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

.hideDescription{
    display:none;
} 

.remove-pair {
    height: fit-content;
    align-self: center;
}

.form-actions {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}
</style>