<template>
    <nav class="home-navbar">
        <div class="navbar-brand">
            <RouterLink :to="{name: 'home'}" class="navbar-item">Home</RouterLink>
        </div>
        <div class="navbar-links">
            <!-- 
            <RouterLink  class="navbar-item">Pricing</RouterLink>
            <RouterLink  class="navbar-item">About</RouterLink> 
            -->
            <div v-if="!loggedIn" >
                <RouterLink :to="{name: 'login'}" class="navbar-item">Login</RouterLink>
                <RouterLink :to="{name: 'signup'}" class="navbar-item">Sign Up</RouterLink>
            </div>
            <div v-else class="navbar-links">
                <RouterLink :to="{name: 'customer_contracts'}"  v-if="userRole === 'customer'" class="navbar-item">
                    My Profile
                </RouterLink>
                <RouterLink :to="{name: 'admin_dashboard'}" v-else-if="userRole === 'admin'" class="navbar-item">
                    Dashboard
                </RouterLink>
                
                <Logout />
            </div>
        </div>
    </nav>
</template>

<script setup>
import { isAuthenticated } from '@/router';
import { ref } from 'vue';
import Logout from '@/components/Logout.vue';
import { jwtDecode } from 'jwt-decode';

// Needs to be a reactive variable in order to update the buttons after logout.
const loggedIn = ref(isAuthenticated()); 
const token = localStorage.getItem('accessToken');
const userRole = ref('');
if(token){
    const decodedToken = jwtDecode(token);
    userRole.value = decodedToken.user.role;
}

</script>
  
<style scoped>
.home-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    font-size: 2rem;
}

.navbar-brand {
    margin-right: auto; 
}

.navbar-links {
    display: flex;
    align-items: center;
}

.home-navbar a:last-child {
    margin-right: 30px; 
}
.home-navbar a {
    padding: 10px;
}
</style>