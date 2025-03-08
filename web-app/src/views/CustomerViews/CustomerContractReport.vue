<template>
    <div class="user-page-container">
        <div v-if="role == 'admin'">
            <AdminNavBar />
        </div>
        <div v-else-if="role == 'customer'">
            <CustomerNavBar />
        </div>
        
        <div class="customer-content">
            <div class="top-bar-section">
                <h1>Service Reports</h1>
                <div class="utility-container">
                    <select v-model="status">
                        <option value="all">All Reports</option>
                        <option value="Solved">Solved</option>
                        <option value="Received">Received</option>
                    </select>
                    
                    <button @click="showCreateForm = true" class="create-button">Create Report</button>
                    <button @click="router.go(-1)" >Go back</button>
                </div>
            </div>

            <!-- Form to create a report -->
            <div v-if="showCreateForm" class="create-form-container">
                <form @submit.prevent="handleSubmit" class="create-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" v-model="newReport.title" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <textarea v-model="newReport.description" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit">Submit</button>
                        <button type="button" @click="hideForm" class="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>

            <table v-if="reports.length" style="margin-top: 20px;">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="report in filteredReports" :key="report._id">
                        <tr>
                            <td>{{ report.title }} </td>
                            <td>{{ report.status }}</td>
                            <td>{{ report.createdAt.split('T')[0] }}</td>
                            <td>
                                <button @click="toggleDescription(report._id)">Description</button>
                                <!-- Is appearing before the description button, but can't really tell why. DOM issue?  -->
                                <button v-if="role!='customer'" @click="updateReport(report._id)" style="margin-right:10px;">Archive</button>
                                <button v-if="role!='customer'" @click="addComment(report._id)" style="margin-right:10px;">Comment</button>
                            </td>
                        </tr>
                        <tr v-if="reportsIds.has(report._id)">
                            <td colspan="4" style="position:absolute">Your Report:{{ report.description }}</td>
                            <ol style="margin-top: 70px; margin-left: 10px;">
                                <lh style="padding:15px; padding-right: 100px;" >Technician replies:</lh>
                                <li v-for="(message, index) in report.messages" :key="index" colspan="4" class = "replymessage"> 
                                {{ message }}
                                </li>
                            </ol>

                        </tr>
                    </template>
                </tbody>
            </table>
            <p v-else class="no-reports">No reports found</p> 
        </div>
    </div>
</template>

<script setup>
import CustomerNavBar from '@/components/CustomerNavBar.vue';
import AdminNavBar from '@/components/AdminNavBar.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '@/config/axios';
import { jwtDecode } from 'jwt-decode';


const route = useRoute();
const router = useRouter();
const toast = useToast();
const reports = ref([]);
const status = ref('all');
const showCreateForm = ref(false);
const canEdit = ref(false);
const role = ref('');
const newReport = reactive({
    id: route.params.id,
    title: '',
    description: ''
});

const reportsIds = ref(new Set());

const toggleDescription = (reportId) => {
    // The description is shown when the id is in reportsIds -> i.e. button is pressed,
    // upon pressing again, we simply remove the respective id therefore hiding the 
    // description. Cleaner solution than using a map as for logs.
    const newSet = new Set(reportsIds.value);
    if (newSet.has(reportId)) {
        newSet.delete(reportId);
    } else {
        newSet.add(reportId);
    }
    reportsIds.value = newSet;
};

const fetchReports = async () => {
    try {
        const response = await apiClient.get(`/user/getReports?id=${route.params.id}`);
        reports.value = response.data.data;
        console.log(reports.value);
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
};

const filteredReports = computed(() => {
    if (status.value === 'all') {
        return reports.value;
    }
    // Returns the reports with the respective/selected status.
    return reports.value.filter(report => report.status == status.value);
});

const handleSubmit = async () => {
    try {
        const response = await apiClient.post('/user/sendReport', newReport);
        //console.log(response);
        if(response.status == 200){
            toast.success('Report created successfully!');
            router.go();
            hideForm();
        } 
    } catch (error) {
        console.error('Error creating report:', error);
        toast.error('Something went wrong while creating the report');
    }
};

const hideForm = () => {
    showCreateForm.value = false;
    newReport.title = '';
    newReport.description = '';
};

const updateReport = async (reportId) => {
    try {
        const response = await apiClient.put('/user/updateReportStatus', {id: reportId});
        if(response.status == 200){
            console.log('Report status updated successfully!');
            router.go();
        } 
    } catch (error) {
        console.error('Error returned: ', error);
        toast.error('Something went wrong while updating the status of the report');
    }
}

onMounted( async()=>{
    await fetchReports();

    const token = localStorage.getItem('accessToken');
    if(token){
        const decodedToken = jwtDecode(token);
        console.log('Accessing the page as ' + decodedToken.user.role);
        if(['admin', 'customer', 'technician'].includes(decodedToken.user.role)){
            canEdit.value = true;
            role.value = decodedToken.user.role;
        }
    }
});
</script>

<style scoped>
.utility-container {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.create-form-container {
    max-width: 600px;
    margin: 2rem auto;
}

.create-form {
    padding: 20px;
    border: 3px solid #CCCCCC;
}

.create-button {
    margin-left: auto;
}

.form-group {
    margin-bottom: 20px;
}

.form-group input, .form-group textarea {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
}

.form-group textarea {
    height: 100px;
}

.form-group button {
    font-size: 1rem;
    padding: 10px 20px;
    border: 2px solid black;
    border-radius: 5px;
    cursor: pointer;
}


.form-group button:hover {
    background-color: #989d8f;
    color: black;
}

.form-group {
    display: flex;
    gap: 15px;
    margin-top: 1.5rem;
}

.customer-content table {
    width: 75%;
    max-width: 75%;
    margin: 0 auto;
    border-collapse: collapse; 
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.customer-content th, .customer-content td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.customer-content th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #2d3748;
}

.customer-content tr:hover {
    background-color: #f8fafc;
}

.customer-content p {
    color: #718096;
    margin-top: 1rem;
    font-style: italic;
}
</style>