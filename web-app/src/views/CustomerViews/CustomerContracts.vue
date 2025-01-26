<template>
    <div class="user-page-container">
        <CustomerNavBar />
        <div class="customer-content">
            <h1>My Contracts</h1>
            <div class="utility-bar">
                <RouterLink :to="{name: 'order_contract'}" >
                    Create Order
                </RouterLink>
            </div>
            <table class="contracts-table">
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody v-if="hasContracts">
                    <tr v-for="contract in customerContracts" :key="contract.id">
                        <td>{{ contract.address }}</td>
                        <td>{{ contract.start_date }}</td>
                         <td>{{ contract.end_date }}</td>
                        <td>{{ contract.status }}</td>
                        <td>
                            <RouterLink :to="{name: 'customer_contract_view', params: {id: contract.id}}" class="view-contract-button">View</RouterLink>
                        </td> 
                        
                    </tr>
                </tbody>
                <tfoot v-else>
                    <tr>
                        <td colspan="5">No contracts available</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup>
import CustomerNavBar from '@/components/CustomerNavBar.vue';
import { onMounted, ref } from 'vue';
import apiClient from '@/config/axios';
import { RouterLink } from 'vue-router';

const hasContracts = ref(false);
const customerContracts = ref([]);

onMounted(async () => {
    try {
        const response = await apiClient.get('/sla/getAllSla'); 
        //console.log(response.data. result);
        if (response.data.result.length > 0){
            let tmp = []
            hasContracts.value = true;
            console.log("here")
            for(let i = 0; i < response.data.result.length; i++){
                let contract= {
                    id: response.data.result[i]._id,
                    address: response.data.result[i].address,
                    start_date: response.data.result[i].start_date.split('T')[0],
                    end_date: response.data.result[i].end_date.split('T')[0],
                    status: response.data.result[i].status
                }
                customerContracts.value.push(contract);          
            }
            //console.log(tmp)  
            //console.log(customerContracts)
        }
          
         
    } catch (error) {
        console.error(error);
    }
})
</script>

<style scoped>
.utility-bar {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.contracts-table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse; /* Avoid/prevent double border above each other */
}

.contracts-table th, .contracts-table td {
    text-align: center;
    padding: 10px;
}

.contracts-table th {
    border-bottom: 2px solid #ddd;
}

.contracts-table td {
    border-bottom: 1px solid #ddd;
}

.contracts-table td:last-child {
    border-bottom: none;
}

.contracts-table tbody tr {
    margin-bottom: 10px; 
}

.contracts-table tbody tr td {
    padding: 15px 10px; 
}

.utility-bar a, .view-contract-button {
    font-size: 1rem;
    padding: 10px 15px;
    border-radius: 5px;
    border: 2px solid black;
    text-decoration: none;
}

.utility-bar a {
    margin-right: 60px;
    text-decoration: none;
}
.utility-bar a:hover, .view-contract-button:hover {
    background-color: #989d8f;
}
</style>
