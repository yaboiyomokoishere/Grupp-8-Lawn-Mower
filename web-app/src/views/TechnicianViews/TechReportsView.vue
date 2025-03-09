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

            <tbody v-for="report in reports" :key="report.sender_id">
                <tr class="report_body">
                    <td>{{ report.sender_id }}</td>
                    <td>{{ report.title }}</td>
                    <td> {{ report.status }}</td>
                    <td>
                        <button @click="showDescription(report._id)">Description</button> 
                    </td>
                </tr>
                <tr  v-if = 'report.description !== "" ' :class ="{hideDescription: !isActive.get(report._id)}" colspan="5">
                    <td  colspan="5" style="position:absolute">Report description: {{ report.description }} </td>
                    <td>
                        <ol style="margin-top: 70px; margin-left: 50px;">
                            <li style="padding:15px;">Reply:</li>
                            <li v-for="(message, index) in report.messages" :key="index" colspan="4" class = "replymessage"> 
                                {{ message }}
                            </li>
                        </ol>
                        <textarea placeholder="Reply" type="text" v-model="formData.messages" style="width:240px; height:150px; margin-left: 50px;"></textarea>
                        <button @click="handleSubmit(report)">Send</button>
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
import { onMounted,ref,reactive, watch } from 'vue';
import { jwtDecode } from 'jwt-decode';



const isActive = ref(new Map());
const reportStatus = ref("Received");
const role = ref('');

const reports = ref([]);


const showDescription = function(id) {
    if (isActive.value.get(id)) {
        isActive.value.set(id, false);
       console.log(isActive.value);
    } else {
        isActive.value.set(id, true);
        console.log(isActive.value);  
    }
}


const fetchReports = async () => {

    const response = await apiClient.get(`/user/getAllReports?status=${reportStatus.value}`);
    //console.log(response.data);
    //reports.value = response.data;

    for (let i = 0; i < response.data.length; i++) {
        let report ={
            _id: response.data[i]._id,
            sender_id: response.data[i].sender_id,
            title: response.data[i].title,
            description: response.data[i].description,
            status: response.data[i].status,
            messages: response.data[i].messages,
            sla_id: response.data[i].sla_id,
        }
        isActive.value.set(i, false);
        reports.value.push(report);
    }
}
const formData = reactive ({
    messages: "",
});
const handleSubmit = async (id) => {
    console.log(formData.messages);
    const send = {
        id: id._id,
        messages: formData.messages,
    }
    try {
        const response = await apiClient.put(`/user/respondReport`, send);
        console.log(response);
        if (response.status == 200) {
            console.log("Message sent successfully");
            formData.messages = "";
            isActive.value.set(id._id, false);
            console.log(isActive.value);
            window.location.reload()
        }
        else {
            console.log("Failed to send message");
        }
    } catch (error) {
        console.error('Error creating report:', error);
    }
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
ol li{
    list-style:none;

}
.hideDescription{
    display:none;
}
.replymessage {
    padding: 15px;
}
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

.tech-content th, .report_body td {
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