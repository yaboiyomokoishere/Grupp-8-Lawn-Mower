<template>
    <div class="user-page-container">
        <TechNavBar />
        <div class = "tech-content">
            <h1>Mower management</h1>
            <select v-model="mowerStatus">
                <option value="Available">Available</option>
                <option value="Broken">Broken</option>
                <option value="Unavailable">Unavailable</option>
            </select>
            <button @click="$router.push({name: 'technician_add_mower'})">Add Mower</button>
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
                        <RouterLink :to="{name: 'technician_mower_edit', params: {id: mower._id}}" class="edit-mower-button">Edit</RouterLink>
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
import apiClient from '@/config/axios';
import { ref, onMounted, watch } from 'vue';

const mowers = ref([]);
const mowerStatus = ref('Available');

const fetchMowers = async () => {
    const response = await apiClient.get(`/robot/getAllRobots?status=${mowerStatus.value}`);
    mowers.value = response.data;
    console.log(mowers.value);
    mowers.value.forEach(mower => {
        mower.last_maintenance_date = new Date(mower.last_maintenance_date).toLocaleDateString();
    });
    

};
watch(mowerStatus, async () => {
    await fetchMowers();
});

onMounted(async () => {
    fetchMowers();
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
.edit-mower-button {
    font-size: 1rem;
    padding: 10px 15px;
    border-radius: 5px;
    border: 2px solid black;
    text-decoration: none;
}

.edit-mower-button:hover {
    background-color: #989d8f;
}
</style>