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
    router.push('../login');
  } catch (error) {
    //console.log('Error creating customer:', error);
    toast.error(error.message);
  }
}
</script>


<template>
    <nav class="customer-navbar">
        <RouterLink to="/" class="navbar-item">Home</RouterLink> <!-- Temporary for testing -->
        <RouterLink to="/customer/profile" class="navbar-item">Profile</RouterLink>
        <RouterLink to="/customer/contracts" class="navbar-item">Contracts</RouterLink>
        <RouterLink to="/" class="navbar-item">Reports</RouterLink>
        <RouterLink to="/" class="navbar-item">TBD</RouterLink>
        <button id= "logout" class="=navbar-item" @click="logout">Logout</button>
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
.customer-navbar a{
    text-decoration: none;
    padding: 10px;
    color: black;   
}

/* Logout button styles */
#logout {
    text-decoration: none;
    font-size: 2rem;
    background-color: white;
    border: none;
    padding: 5px;
    color: black; /* Adjust color as needed */
    cursor: pointer;
}


/* Hover effect on navigation links and logout button */
.customer-navbar a:hover, #logout:hover {
    background-color: #f0f0f0; /* Optional hover effect */
    border: black;
}

</style>

