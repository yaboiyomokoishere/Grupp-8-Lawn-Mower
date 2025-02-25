<template>
    <div class="user-page-container">
        <AdminNavBar />
        <div class="admin-content">
            <h1>Users Management</h1>
            <select v-model="userRole">
                <option value="customer">Customers</option>
                <option value="technician">Technicians</option>
                <option value="organization">Organizations</option>
            </select>
            <RouterLink :to="{name:'admin_create_user'}"><button>Create New User</button></RouterLink>
            <table v-if="users.length">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.first_name }} {{ user.last_name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }}</td>
                        <td>
                            <RouterLink :to="{name: 'admin_user_edit', params: {customerId: user._id}}" class="edit-user-button">Edit</RouterLink>
                        </td>                        
                    </tr>
                </tbody>
            </table>
            <p v-else style="text-align: center; font-size:20px; color:black">No users with the chosen type</p>
        </div>
    </div>
</template>

<script setup>
import AdminNavBar from '@/components/AdminNavBar.vue';
import apiClient from '@/config/axios';
import { onMounted, ref, watch } from 'vue';

const users = ref([]);
const userRole = ref('customer');

const fetchUsers = async () => {
    const response = await apiClient.get(`/user/getUsers?role=${userRole.value}`);
    users.value = response.data;
    console.log(users.value);
}

watch(userRole, async () => {
    await fetchUsers();
})

onMounted(async () => {
    await fetchUsers();
})
</script>

<style scoped>

.admin-content select {
    padding: 1rem;
    font-size: 1.2rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.3rem;
    margin-bottom: 1.5rem;
    background-color: white;
    width: 200px;
}

.admin-content table {
    width: 100%;
    border-collapse: collapse; 
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.admin-content th, .admin-content td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.admin-content th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #2d3748;
}

.admin-content tr:hover {
    background-color: #f8fafc;
}

.admin-content p {
    color: #718096;
    margin-top: 1rem;
    font-style: italic;
}


.edit-user-button {
    font-size: 1rem;
    padding: 10px 15px;
    border-radius: 5px;
    border: 2px solid black;
    text-decoration: none;
}

.edit-user-button:hover {
    background-color: #989d8f;
}
</style>