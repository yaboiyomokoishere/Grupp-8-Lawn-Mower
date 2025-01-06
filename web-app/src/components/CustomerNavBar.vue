<script setup>

import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import axios from "axios";

const toast = useToast();
const router = useRouter();

const logout = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/user/logout', {}, { withCredentials: true });
    localStorage.removeItem('accessToken');
    toast.success('Customer logged out successfully');
    router.push({name: 'login'});
  } catch (error) {
    //console.log('Error creating customer:', error);
    toast.error(error.message);
  }
}
</script>


<template>
    <nav class="customer-navbar">
        <RouterLink :to="{name: 'home'}" class="navbar-item">Home</RouterLink> <!-- Temporary for testing -->
        <RouterLink :to="{name: 'customer_profile'}" class="navbar-item">Profile</RouterLink>
        <RouterLink :to="{name: 'customer_contracts'}" class="navbar-item">Contracts</RouterLink>
        <RouterLink :to="{name: 'home'}" class="navbar-item">Reports</RouterLink>
        <button id= "logout" class="navbar-item" @click="logout">Logout</button>
    </nav>
</template>
  

<style scoped>
/* Navigation bar styles */
.customer-navbar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 5px;
    font-size: 2rem;
}

/* Navigation link styles */
.customer-navbar a, #logout {
    text-decoration: none;
    padding: 10px;
    color: black; /* Adjust color as needed */
}

/* Logout button styles */
#logout {
    font-size: 2rem;
    background-color: white;
    border: none;
    cursor: pointer;
    padding: 10px;
    margin: 0;     
    font-family: 'Roboto', sans-serif; 
    display: flex;
    width: auto; 
}


.customer-navbar a:hover, #logout:hover {
    background-color: #f0f0f0;
}

</style>

