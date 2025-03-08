<template>
    <div class="user-page-container">
        <AdminNavBar />

        <div class = "customer-content">
            <h1>Add Mower</h1>
            <div class="form-container">
                <form @submit.prevent="handleSubmit">
                    <label for="robot_model">Robot Model</label><br>
                    <select name="robot_model" id="robot_model" v-model="formData.robot_model" required>
                        <option v-for ="mower in mowers":key="mower.id" :value="mower.model">{{ mower.model }}</option>
                    </select>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="serial_number" >Serial Number(bara nummer)</label><br>
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
import AdminNavBar from '@/components/AdminNavBar.vue';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import apiClient from '@/config/axios';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { jwtDecode } from 'jwt-decode';


const router = useRouter();
const mowers = ref([]);
const role = ref('');

const formData = reactive({
    serial_number: ''
})

const handleSubmit = async () => {
    if (isNaN(formData.serial_number)){
        alert('inkorrekt inmatning');
        return;
    }
    const addRobot ={
        serial_number: formData.serial_number,
        model: formData.robot_model
    }
    try {
        const response = await apiClient.post('/robot/registerRobot', addRobot);
        console.log(response.data);
        //router.push({ name: 'technician_add_mower' });
        alert('robot tillagd');
        await router.go();
    } catch (error) {
        alert("NOT THAT SERIAL NUMBER!!!")
        console.error('Error creating robot:', error);
    }
};
    
const fetchMowers = async () => {
    const response = await apiClient.get('/user/getPriceLists');
    //console.log(mowers);
    //mowers.value.push(...response.data)
    mowers.value = response.data;
    //console.log(mowers.value);
    return;
};

onMounted(async () => {
    await fetchMowers();

    const token = localStorage.getItem('accessToken');
    if(token){
        const decodedToken = jwtDecode(token);
        console.log('Accessing the page as ' + decodedToken.user.role);
        if(['admin'].includes(decodedToken.user.role)){
            role.value = decodedToken.user.role;
        }
    }
});    
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