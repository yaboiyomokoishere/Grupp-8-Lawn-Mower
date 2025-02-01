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
            <div v-else >
                <RouterLink :to="{name: 'customer_contracts'}" class="navbar-item">My Profile</RouterLink>
                <Logout />
            </div>
        </div>
    </nav>
</template>

<script setup>
import { isAuthenticated } from '@/router';
import { ref } from 'vue';
import Logout from '@/components/Logout.vue';
// Needs to be a reactive variable in order to updated the buttons after logout.
const loggedIn = ref(isAuthenticated()); 
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