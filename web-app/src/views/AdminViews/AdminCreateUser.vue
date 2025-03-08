<template>
    <div class="user-page-container">
        <AdminNavBar />
        <div class="admin-content">
            
            <div class="back-button-container">
                <RouterLink  class="back-button">
                    <button @click="$router.back()">Go back</button>
                </RouterLink>
            </div>

            <div class="create-user-form-container">
                <form @submit.prevent="handleSubmit">
                    <legend>Create user</legend>

                    <div class="form-row">
                        <div class="form-group">
                            <label>First name</label>
                            <input type="text" id="first_name" v-model="basicUser.firstName" required/>
                        </div>

                        <div class="form-group">
                            <label>Last name</label>
                            <input type="text" id="last_name" v-model="basicUser.lastName" required/>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="email" v-model="basicUser.email" required/>
                        </div>

                        <div class="form-group">
                            <label>Role</label>
                            <select v-model="basicUser.role" required>
                                <option value="customer">Customer</option>
                                <option value="technician">Technician</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="password" v-model="basicUser.password" required/>
                        </div>

                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input type="password" id="confirmPassword" v-model="basicUser.confirmPassword" required/>
                        </div>
                    </div>

                    <div v-if="basicUser.role == 'customer'">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Address</label>
                                <input type="text" id="address" v-model="basicUser.customerDetails.address" />
                            </div>
                            <div class="form-group">
                                <label>Postal Code</label>
                                <input type="number" id="postal_code" v-model.number="basicUser.customerDetails.postal_code" />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="number" id="phone_number" v-model.number="basicUser.customerDetails.phone_number" />
                            </div>
                        </div>
                    </div>
                    <!-- Add more v-else if container for other roles if extra fields become required. -->
                    <button type="submit">Create User</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import AdminNavBar from '@/components/AdminNavBar.vue';
import { reactive } from 'vue';
import apiClient from '@/config/axios';


const basicUser = reactive({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    customerDetails: {
        address: '',
        postal_code: '',
        phone_number: ''
    }
});

const handleSubmit = async () => {
    if (basicUser.password.length < 8 || basicUser.password !== basicUser.confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Customer_details validation
    if (basicUser.role === 'customer') {
        const { address, postal_code, phone_number } = basicUser.customerDetails;
        if (!address || !postal_code || !phone_number) {
            alert('Fill in all customer details');
            return;
        }
    }
    // Validate other roles details when defined.

    const newUser = {
        firstName: basicUser.firstName,
        lastName: basicUser.lastName,
        email: basicUser.email,
        password: basicUser.password,
        role: basicUser.role
    };

    if (basicUser.role === 'customer') {
        newUser.customerDetails = { 
            ...basicUser.customerDetails 
        };
    }
    // Add more conditions checks for other roles when the technician/admin details are well-defined.

    try {
        const response = await apiClient.post('/user/createUser', newUser)
        if (response.status == 200) {
            console.log("User created, messag: ", response.data);
            alert("USER CREATED!!!!!");
            return;
        } else if (response.status==406){
            alert('Email not available');
            return;
        }
    } catch (error) {
        alert('Error: ' + error);
    }
};
</script>

<style setup>
form {
	padding: 20px;
	border-style: solid;
	border-color: #CCCCCC;
	border-width: 3px;
	border-radius: 5px;
}

.form-row {
	display: flex;
	gap: 20px; 
	margin-bottom: 20px;
}

input, label, select{
	display: block;
}

input, select {
	font-size: 1.2rem;
	padding: 10px;
}

button {
    font-size: 1rem;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    border: 2px solid black;
}

button:hover{
    background-color: #989d8f;
    color:black;
}
</style>