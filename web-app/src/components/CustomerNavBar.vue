<template>
    <nav class="customer-navbar">
        <div class="navbar-links">
            <RouterLink :to="{name: 'home'}" class="navbar-item">Home</RouterLink> <!-- Temporary for testing -->
            <RouterLink :to="{name: 'customer_profile'}" class="navbar-item">Profile</RouterLink>
            <RouterLink :to="{name: 'customer_contracts'}" class="navbar-item">Contracts</RouterLink>
            <!-- <RouterLink :to="{name: 'home'}" class="navbar-item">Reports</RouterLink> -->
        </div>
        <div class="logout-button">
            <Logout />
        </div>
    </nav>
</template>
  

<script setup>
import Logout from '@/components/Logout.vue';
</script>


<style scoped>
.customer-navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100vh;
    border-right: 1px solid #e5e7eb;
    font-size: 2rem;
    display: flex;
    flex-direction: column;
}

.navbar-links {
    padding: 1rem 0;
    flex-grow: 1;
}

.navbar-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
}

.logout-button {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>

