<template>
    <div class="user-page-container">
        <div v-if="role == 'technician'">
            <TechNavBar />
        </div>
        <div v-else-if="role == 'admin'">
            <AdminNavBar />
        </div>
        <div class = "tech-content">
            <h1>Mower management</h1>
            <div style="display: flex;">
                <select v-model="mowerStatus">
                    <option value="Available">Available</option>
                    <option value="Broken">Broken</option>
                    <option value="Unavailable">Unavailable</option>
                </select>
                
                <button v-if="role == 'admin'" @click="router.push({name: 'technician_add_mower'})" style="margin-left: auto; height:fit-content ;">
                    Add Mower
                </button>
            </div>
            <table v-if="mowers.length">
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Model</th>
                        <th>Status</th>
                        <th>Last Maintenance</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="mower in mowers" :key="mower.id">
                        <td>{{ mower.serial_number }}</td>
                        <td>{{ mower.model }}</td>
                        <td>{{ mower.status }}</td>
                        <td>{{ mower.last_maintenance_date }}</td>
                        <td>
                            <RouterLink to="#" v-if="mower.status=='Broken'">
                                <button @click="fixRobot(mower.serial_number)" class="update-status-button">Fixed</button>
                            </RouterLink>
                        </td>                        
                    </tr>
                    
                </tbody>
            </table>
            <p v-else style="text-align: center; font-size: 20px; color:black">No mowers found</p>
        </div>
    </div>
    
</template>

<script setup>
import TechNavBar from '@/components/TechNavBar.vue';
import AdminNavBar from '@/components/AdminNavBar.vue';
import apiClient from '@/config/axios';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();
const mowers = ref([]);
const mowerStatus = ref('Available');
const role = ref('');

const fetchMowers = async () => {
    const response = await apiClient.get(`/robot/getAllRobots?status=${mowerStatus.value}`);
    mowers.value = response.data;
    mowers.value.forEach(mower => {
        mower.last_maintenance_date = new Date(mower.last_maintenance_date).toLocaleDateString();
    });
};
watch(mowerStatus, async () => {
    await fetchMowers();
});

const fixRobot = async (serialNumber) => {
    try {
        console.log("Updating robot status to fixed...");
        const response = await apiClient.post(`/robot/maintenance`, {serial_number: serialNumber});
        if (response.status == 200){
            console.log("Status updated successfully!");
            alert("Status updated to Available.");
            await router.go();
        }
    } catch (error) {
        console.log(error);
    }
};

onMounted(async () => {
    await fetchMowers();

    const token = localStorage.getItem('accessToken');
    if(token){
        const decodedToken = jwtDecode(token);
        console.log('Accessing the page as ' + decodedToken.user.role);
        if(['admin', 'technician'].includes(decodedToken.user.role)){
            role.value = decodedToken.user.role;
        }
    }
});

</script>

<style scoped>
.tech-content select {
    padding: 1rem;
    font-size: 1.2rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.3rem;
    margin-bottom: 1.5rem;
    background-color: white;
    width: 200px;
}

.tech-content table {
    width: 100%;
    border-collapse: collapse; 
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tech-content th, .tech-content td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.tech-content th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #2d3748;
}

.tech-content tr:hover {
    background-color: #f8fafc;
}

.tech-content p {
    color: #718096;
    margin-top:1rem;
    font-style: italic;
}

.edit-mower-button, .update-status-button {
    font-size: 1rem;
    padding: 10px 15px;
    border-radius: 5px;
    border: 2px solid black;
    text-decoration: none;
}

.edit-mower-button:hover, .update-status-button:hover {
    background-color: #989d8f;
}

.update-status-button {
    margin-left: 20px;
}
</style>