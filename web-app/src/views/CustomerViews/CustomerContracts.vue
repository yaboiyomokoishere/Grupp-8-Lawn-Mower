<template>
    <div class="user-page-container">
        <CustomerNavBar />
        <div class="customer-content">
            <h1>My Contracts</h1>
            <div class="utility-bar">
                <button class="order-contract-button">Order Contract</button>
            </div>
            <table class="contracts-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Address</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Standard</td>
                        <td>Kungsgatan 1</td>
                        <td>2022-01-01</td>
                        <td>2022-12-31</td>
                        <td>Pending</td>
                        <td>
                            <button class="view-contract-button">View</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Standard</td>
                        <td>Kungsgatan 1</td>
                        <td>2022-01-01</td>
                        <td>2022-12-31</td>
                        <td>Pending</td>
                        <td>
                            <button class="view-contract-button">View</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import CustomerNavBar from '@/components/CustomerNavBar.vue';
import { onMounted, ref } from 'vue';
import apiClient from '@/config/axios';

const customerContracts = ref([]);

onMounted(async () => {

    try {
        //const response = await apiClient.get('/users/me', config); TO BE DEFINED
        //console.log(response.data);

        //customerContracts.value = response.data; // Contracts to display
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
    border-collapse: collapse; /* Avoid/remove double border */
}

.contracts-table th, .contracts-table td {
    text-align: center;
    padding: 10px;
}

.contracts-table th {
    border-bottom: 2px solid #ddd;
}
/* ADd border to table rows */
.contracts-table td {
    border-bottom: 1px solid #ddd;
}

/* Remove border for buttons */
.contracts-table td:last-child {
    border-bottom: none;
}

/* Spacing between rows */
.contracts-table tbody tr {
    margin-bottom: 10px; 
}

.contracts-table tbody tr td {
    padding: 15px 10px; 
}
</style>
