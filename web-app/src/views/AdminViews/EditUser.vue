<template>
    <div class="user-page-container">
        <AdminNavBar />
        <div class="admin-content">
            <h1>Edit User</h1>

            <div class="go-back">
                <RouterLink :to="{name: 'admin_users'}" >
                    <button class="go-back-link">Go Back</button>
                </RouterLink>
            </div>
            <div class="admin-user-view">
                <div class="account-info">
                    <div class="edit-user-form">
                        <form @submit.prevent="handleSubmit">
                           <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName">First Name:</label>
                                    <input type="text" id="firstName" v-model="user.firstName" :readonly="!isEditing" />
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Last Name:</label>
                                    <input type="text" id="lastName" v-model="user.lastName" :readonly="!isEditing" />
                                </div>
                            </div>
                            <div class="form-row"> 
                                <div class="form-group">
                                    <label for="email">Email:</label>
                                    <input type="email" id="email" v-model="user.email" :readonly="!isEditing" />
                                </div>
                                <div class="form-group">
                                    <label for="status">Status:</label>
                                    <input type="text" id="status" v-model="user.status" readonly />
                                </div>

                            </div>
                            <div class="form-group">
                                <label for="status">Role:</label>
                                <input type="text" id="status" v-model="user.role" :readonly="!isEditing" />
                            </div>

                            <div class="form-actions">
                                <button type="button" @click="editUser">{{ isEditing ? 'Save' : 'Edit' }}</button>
                                <button type="button" @click="changeStatus">
                                    {{ user.status === 'active' ? 'Deactivate' : 'Activate' }} User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="user-contracts" v-if="customerContracts.length">
                    <h2 style="text-align: center; margin-bottom: 20px;">Contracts</h2>
                    <table class="contracts-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Status</th>
                                <th >View</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="contract in customerContracts" :key="contract.id">
                                <td>{{ contract.id.slice(0,5) }}</td>
                                <td>{{ contract.status }}</td>
                                <td class="view-button">
                                    <RouterLink :to="{ name: 'admin_user_sla', params: { id: contract.id,  } }">
                                        <button>View</button>
                                    </RouterLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import AdminNavBar from '@/components/AdminNavBar.vue';
import apiClient from '@/config/axios';
import { useRoute } from 'vue-router';

const $route = useRoute();
const isEditing = ref(false);
const customerContracts = ref([]);


const user = reactive({
    firstName: '',
    lastName: '',
    email: '',
    status: '',
    role:'',
    email:''
});


const editUser = async () => {
    if (isEditing.value) {
        const updatedUser = {
            id: $route.params.customerId,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            role: user.role,
            email: user.email
        }
        const response = await apiClient.put('user/updateUser', updatedUser);
        if (response.status == 200){
            console.log("User updated successfullyresponse");
            isEditing.value = false;
        } else {
            console.log("Something went wrong while editing the user data.")
        }
    } else {
        isEditing.value = true;
    }
};

const changeStatus = async () => {
    const userId = $route.params.customerId;
    try {
        const response = await apiClient.put('user/toggleUserStatus', { id: userId });
        if(response.status == 200){
            user.status = response.data.status;    
            console.log("Status updated successfully to " + user.status);
        }
    } catch(error) {
        console.error(error);
    }
};

const fetchContracts = async () => {
    try {
        const userId = $route.params.customerId;
        console.log(userId)
        const response = await apiClient.get('/user/getUserSlas?userId=' + userId); 
        console.log("Loading user contracts...");
        if (response.data.result.length > 0){
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
            console.log("Contracts loaded successfully!");
            return;
        }
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    const userId = $route.params.customerId;
    const response = await apiClient.get(`user/getUser?id=${userId}`);
    console.log(response.data);
    user.firstName = response.data.first_name;
    user.lastName = response.data.last_name;
    user.email = response.data.email;
    user.status = response.data.status;
    user.role = response.data.role;

    await fetchContracts();
});
</script>

<style scoped>
.edit-user-form {
    display:flex;
}

form , .user-contracts{
    padding: 20px;
    border-style: solid;
    border-color: #CCCCCC;
    border-width: 3px;
    border-radius: 5px;
    background-color: white;
}

.form-group {
    margin-bottom: 20px;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
}

label, input {
    display: block;
}

input, button {
    font-size: 1.2rem;
    padding: 10px;
    box-sizing: border-box;
}

input{
    width: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
}

input[readonly] {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

.form-actions {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.form-actions button, .go-back-link {
    flex: 1;
    font-size: 1.2rem;
    padding: 10px;
    border: 2px solid #CCCCCC;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.form-actions button:hover, .go-back-link:hover {
    background-color: #f0f0f0;
    border-color: #999;
}

.go-back {
    display: flex;
    text-decoration: none;
    margin-bottom: 20px;
    width: fit-content;
    margin-left: auto;
}

.admin-user-view {
    display: flex;
    gap: 20px;
}

.account-info {
    flex: 1;
}

.user-contracts {
    flex: 1;
}

.user-contracts table {
    width: 100%;
    border-collapse: collapse; 
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-contracts th, .user-contracts td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.user-contracts th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #2d3748;
}

.user-contracts tr:hover {
    background-color: #f8fafc;
}

.view-button {
    display: inline-block;
}
</style>