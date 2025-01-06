<script setup>
import { isAuthenticated } from '@/router';
import { useRouter } from "vue-router";
import axios from "axios";
import { ref } from 'vue';


const router = useRouter();

// Needs to be a reactive variable in order to updated the buttons after logout
const loggedIn = ref(isAuthenticated()); 

const logout = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/user/logout', {}, { withCredentials: true });
    localStorage.removeItem('accessToken');
    router.push({name: 'login'});
  } catch (error) {
    console.log('Error creating customer:', error);
  }
}
</script>


<template>
    <nav class="home-navbar">
        <div class="navbar-brand">
            <RouterLink :to="{name: 'home'}" class="navbar-item">Home</RouterLink>
        </div>

        <div v-if="!loggedIn" class="navbar-links">
            <RouterLink :to="{name: 'login'}" class="navbar-item">Login</RouterLink>
            <RouterLink :to="{name: 'signup'}" class="navbar-item">Sign Up</RouterLink>
        </div>
        
        <div v-else class="navbar-links">
            <RouterLink :to="{name: 'customer_dashboard'}" class="navbar-item">Profile</RouterLink>
            <button  id="logout" class="navbar-item" @click="logout">Logout</button>
        </div>
    </nav>
</template>
  

  
<style scoped>
.home-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    font-size: 2rem;
}

.navbar-brand {
    margin-right: auto; /* Pushes the Home button to the far left */
}

.navbar-links {
    display: flex;
    align-items: center;
}

.home-navbar a, #logout {
    text-decoration: none;
    padding: 10px;
    color: black; /* Adjust color as needed */
}

.home-navbar a:last-child {
    margin-right: 40px; /* Adds extra space for the last item */
}

.home-navbar a:hover, #logout:hover {
    background-color: #f0f0f0; /* Optional hover effect */
}

#logout {
    font-size: 2rem;
    background-color: white;
    border: none;
    cursor: pointer;
    padding: 10px;
    margin: 0;     
    font-family: 'Roboto', sans-serif; 
}

</style>

