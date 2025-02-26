<template>
    <div class="user-page-container">
        <CustomerNavBar />
        <div class="admin-content">
            <div class="top-bar-section">
                <h1>Customer Reports</h1>
                <select v-model="status">
                    <option value="all">All Reports</option>
                    <option value="solved">Solved</option>
                    <option value="ongoing">Ongoing</option>
                </select>
                <button @click="showCreateForm = true" class="create-button">Create Report</button>
            </div>

            <!-- Form to create a report -->
            <div v-if="showCreateForm" class="create-form">
                <form @submit.prevent="handleSubmit">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" v-model="newReport.title" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <textarea v-model="newReport.description" required></textarea>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" @click="hideForm" class="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>

            <!-- Reports Table -->
            <table v-if="reports.length">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>SLA Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in filteredReports" :key="report.id">
                        <td>{{ report.title }}</td>
                        <td>{{ report.description }}</td>
                        <td>{{ report.status }}</td>
                        <td>{{ report.slaStatus }}</td>
                        <td>
                            <RouterLink 
                                :to="{name: 'report-details', params: {reportId: report._id}}" 
                                class="view-button"
                            >
                                View Responses
                            </RouterLink>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else class="no-reports">No reports found</p>
        </div>
    </div>
</template>

<script setup>
import CustomerNavBar from '@/components/CustomerNavBar.vue';
import { ref, computed, watch, onMounted } from 'vue';
import apiClient from '@/config/axios';

const reports = ref([]);
const status = ref('all');
const showCreateForm = ref(false);
const newReport = ref({
    title: '',
    description: ''
});


const fetchReports = async () => {
    try {
        const response = await apiClient.get(`/reports?status=${status.value}`);
        reports.value = response.data;
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
};

const filteredReports = computed(() => {
    if (status.value === 'all') {
        return reports.value;
    }
    // Returns the reports with the respective/selected status.
    return reports.value.filter(report => report.slaStatus === status.value);
});


const handleSubmit = async () => {
    try {
        if (!newReport.value.title || !newReport.value.description) {
            alert('Please fill all required fields');
            return;
        }

        const response = await apiClient.post('/reports', newReport.value);
        reports.value.push(response.data);
        hideForm();
        alert('Report created successfully!');
    } catch (error) {
        console.error('Error creating report:', error);
        alert('Failed to create report');
    }
};

const hideForm = () => {
    showCreateForm.value = false;
    newReport.value = { title: '', description: '' };
};

// Update the reports when the sorting status is changed 
watch(status, fetchReports);

onMounted( async()=>{
    await fetchReports();
})
</script>

<style scoped>

</style>