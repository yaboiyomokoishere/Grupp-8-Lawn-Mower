<template>
    <div class="user-page-container">
        <AdminNavBar />
        <div class="admin-content">
            <h1>Edit User</h1>
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
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import AdminNavBar from '@/components/AdminNavBar.vue';
import apiClient from '@/config/axios';
import { useRoute } from 'vue-router';

const $route = useRoute();
const isEditing = ref(false);

const user = reactive({
    firstName: '',
    lastName: '',
    email: '',
    status: '',
    role:'',
    email:''
});


const editUser = () => {
    if (isEditing.value) {
        const updatedUser = {
            id: $route.params.id,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            role: user.role,
            email: user.email
        }
        const response = apiClient.put('user/updateUser', updatedUser);
        console.log(response);
        isEditing.value = false;
    } else {
        isEditing.value = true;
    }
};

const changeStatus = async () => {
    const userId = $route.params.id;
    try {
        const response = await apiClient.put('user/toggleUserStatus', { id: userId });
        //console.log(response.data);
        user.status = response.data.status;    
        console.log("Status updated successfully to " + user.status);
    } catch(error) {
        console.error(error);
    }
    
};

onMounted(async () => {
    const userId = $route.params.id;
    const response = await apiClient.get(`user/getUser?id=${userId}`);
    console.log(response.data);
    user.firstName = response.data.first_name;
    user.lastName = response.data.last_name;
    user.email = response.data.email;
    user.status = response.data.status;
    user.role = response.data.role;
});
</script>

<style scoped>

.edit-user-form {
    display:flex;
}

form {
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

.form-actions button {
    flex: 1;
    font-size: 1.2rem;
    padding: 10px;
    border: 2px solid #CCCCCC;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.form-actions button:hover {
    background-color: #f0f0f0;
    border-color: #999;
}

</style>