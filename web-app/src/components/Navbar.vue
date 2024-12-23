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
    <nav class="navbar">
        <div class="navbar-brand">
            <RouterLink to="/" class="navbar-item">Home</RouterLink>
        </div>
        <div v-if="!loggedIn">
            <RouterLink to="/login" class="navbar-item">Login</RouterLink>
            <RouterLink to="/signup" class="navbar-item">Sign Up</RouterLink>
        </div>
        <button v-else id="logout" class="navbar-item" @click="logout">Logout</button>
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
    gap: 20px; /* Adds space between the Login and Sign Up links */
}

.navbar a {
    text-decoration: none;
    padding: 10px;
    color: black; /* Adjust color as needed */
}

.navbar a:last-child {
    margin-right: 40px; /* Adds extra space for the last item */
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

