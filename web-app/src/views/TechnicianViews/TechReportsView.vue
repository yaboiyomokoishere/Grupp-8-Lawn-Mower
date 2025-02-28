<template>
    <div class="tech-page-container">
        <div v-if="role == 'technician'">
            <TechNavBar />
        </div>
        <div v-else-if="role == 'admin'">
            <AdminNavBar />
        </div>
        
        <div class = "tech-content">
            <h1>Reports</h1>
            <select v-model="reportStatus">
                <option value="Received">Received</option>
                <option value="Solved">Solved</option>
            </select>
            <table v-if="reports.length">
                <thead>
                    <tr>
                        <th>Sender</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in reports" :key="report.id">
                        <td>{{ report.sender_id }}</td>
                        <td>{{ report.title }}</td>
                        <td> {{ report.status }}</td>
                        <td>
                        <RouterLink :to="{name: 'technician_report_view', params: {id: report._id}}"  class="edit-report-button">View</RouterLink> 
                        </td>
                    </tr>
                </tbody>
            </table> 
            <p v-else style="text-align:center; font-size:20px; color:black">No Reports Found</p>   
        </div>
    </div>
</template>

<script setup>
import TechNavBar from '@/components/TechNavBar.vue';
import AdminNavBar from '@/components/AdminNavBar.vue';
import apiClient from '@/config/axios';
import { jwtDecode } from 'jwt-decode';
import { onMounted, ref, watch } from 'vue';

const reports = ref([]);
const reportStatus = ref("Received");
const role = ref('');

const fetchReports = async () => {
    const response = await apiClient.get(`/user/getAllReports?status=${reportStatus.value}`);
    console.log(response.data.data)
    reports.value = response.data.data;
}

watch(reportStatus, async () => {
    await fetchReports();
});

onMounted(async () => {
    await fetchReports();

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

<style>
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