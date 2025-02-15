<template>
    <div class="user-page-container">
        <CustomerNavBar />
        <div class="customer-content">
            <h1>SLA - ID: {{ $route.params.id }}</h1>
            <div class="back-button-container">
                <RouterLink :to="{name: 'customer_contract_view', paramas: {id: $route.params.id}}" class="back-button">
                    <button>Go back</button>
                </RouterLink>
            </div>
            <table v-if= "customerLogs.length" >
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Changed by</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody v-for=" log in customerLogs" :key="log.id">
                    <tr >
                        <td><p>{{ log.action }}</p></td>
                        <td><p>{{ log.changed_by }}</p></td>
                        <td><p class="date"> {{ log.date }}</p></td>
                        <td v-if = 'log.description !== ""'> 
                            <button @click="showDescription(log.id)">Description</button>
                        </td>
                    </tr>
                    <tr v-if = 'log.description !== "" ' :class="{hideDescription: !isActive.get(log.id)}">
                        <td>{{ log.description }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else>
                <p>Error while fetching the logs</p>
            </div>            
        </div>
    </div>
</template>


<script setup>
import apiClient from '@/config/axios';
import CustomerNavBar from '@/components/CustomerNavBar.vue';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router';

const $route = useRoute();
const customerLogs = ref([]);
const isActive = ref(new Map());

const showDescription = function(logId){
    //console.log(logId);
    if (isActive.value.get(logId)) {
        isActive.value.set(logId, false);
    } else {
        isActive.value.set(logId, true);
    }
}

onMounted(async () => {
    try {
        const id = $route.params.id;
        console.log(id);
        const response = await apiClient.get(`/sla/getSlaLog?id=${id}`); 
        //console.log(response.data);
        console.log(response.data.events[0]);
        for(let i = 0; i < response.data.events.length; i++) {
            //logData.action = response.data.events[i].action;
            //logData.changed_by = response.data.events[i].changed_by; 
            //logData.date = response.data.events[i].date.split('T')[0];
            let log = {
                id: i,
                action: response.data.events[i].action,
                changed_by: response.data.events[i].changed_by,
                date: response.data.events[i].date.split('T')[0],
                description: response.data.events[i].description
            }
            isActive.value.set(i, false);
            //logData.action = response.data.events[i].action;
            //logData.changed_by = response.data.events[i].changed_by; 
            //logData.date = response.data.events[i].date.split('T')[0];
            customerLogs.value.push(log);
        }
        //console.log(customerLogs.value);

    } catch (error) {
        console.log(error);
    }
});
</script>

<style>

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
</style>