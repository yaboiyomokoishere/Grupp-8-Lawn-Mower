<script setup>
import { isAuthenticated } from '@/router';
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import axios from "axios";
import { ref } from 'vue';

const toast = useToast();
const router = useRouter();

// Needs to be a reactive variable in order to updated the buttons after logout
const loggedIn = ref(isAuthenticated()); 

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
    <nav class="home-navbar">
        <div class="navbar-brand">
            <RouterLink to="/" class="navbar-item">Home</RouterLink>
        </div>

        <div v-if="!loggedIn" class="navbar-links">
            <RouterLink to="/login" class="navbar-item">Login</RouterLink>
            <RouterLink to="/signup" class="navbar-item">Sign Up</RouterLink>
        </div>
        
        <div v-else class="navbar-links">
            <RouterLink to="/customer/dashboard" class="navbar-item">Profile</RouterLink>
            <button  id="logout" class="navbar-item" @click="logout">Logout</button>
        </div>
    </nav>
</template>
  

  
<style scoped>
.home-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    font-size: 2rem;
}

.navbar-brand {
    margin-right: auto; /* Pushes the Home button to the far left */
}

.navbar-links {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.home-navbar a {
    text-decoration: none;
    padding: 10px;
    color: black; /* Adjust color as needed */
}

.home-navbar a:last-child {
    margin-right: 40px; /* Adds extra space for the last item */
}

.home-navbar a:hover {
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

