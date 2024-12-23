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
    router.push('./login');
  } catch (error) {
    //console.log('Error creating customer:', error);
    toast.error(error.message);
  }
}
</script>


<template>
    <nav  class="navbar">
        <div class="navbar-brand">
            <RouterLink to="/" class="navbar-item">Home</RouterLink> <!-- Temporary for testing -->
        </div>
        <button id= "logout" class="=navbar-item" @click="logout">Logout</button>
    </nav>
</template>
  

  
<style scoped>
.navbar {
    width: 100%;
    padding: 5px;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
}

.navbar-brand {
    margin-right: auto; /* Pushes the Home button to the far left */
}

.navbar-links {
    display: flex;
    align-items: center;
}

.navbar a{
    text-decoration: none;
    padding: 10px;
    color: black;
    
}

.navbar a:hover {
    background-color: #f0f0f0; /* Optional hover effect */
}

#logout {
    margin-left: auto; /* Pushes the Logout button to the far right */
    margin-right: 20px;
    text-decoration: none;
    font-size: 2rem;
    background-color: white;
    border: none;
    padding: 10px;
    color: black; /* Adjust color as needed */
    cursor: pointer;
}

#logout:hover {
    background-color: #f0f0f0; /* Optional hover effect */
}
</style>

