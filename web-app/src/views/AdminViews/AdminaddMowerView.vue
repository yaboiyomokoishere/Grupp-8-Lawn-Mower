<template>
    <div class="user-page-container">
        <AdminNavBar />
        <div class = "customer-content">
            <h1>Add Mower</h1>
            <div class="form-container">
                <form @submit.prevent="handleSubmit">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="serial_number" >Serial Number</label><br>
                            <input type="text" name="serial_number" id="serial_number" v-model="formData.serial_number">
                        </div>
                    </div>
                    <button type="submit">Add Mower</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import AdminNavBar from '@/components/TechNavBar.vue';
import { reactive } from 'vue';
import apiClient from '@/config/axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = reactive({
    serial_number: '',
    
})

const handleSubmit = async () => {
   
    const addRobot ={
        serial_number: formData.serial_number,
        
    }
    try {
        const response = await apiClient.post('/robot/registerRobot', addRobot);
        console.log(response.data);
        router.push({ name: 'admin_mowers' });
    } catch (error) {
        console.error('Error creating robot:', error);
    }
};
</script>

<style scoped>
form {
    padding: 20px;
    border-style: solid;
    border-color: #CCCCCC;
    border-width: 3px;
    border-radius: 5px;
}

.form-row {
    display: flex;
    gap: 20px; 
    margin-bottom: 20px;
}

input, label, select{
    display: block;
}

input, select {
    font-size: 1.2rem;
    padding: 10px;
}

button {
    font-size: 1rem;
    text-decoration: none;
    padding: 10px;
    border: solid;
    border-radius: 5px;
    border-color: #CCCCCC;
}
</style>