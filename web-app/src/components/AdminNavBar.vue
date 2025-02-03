<template>
    <nav class="admin-navbar">
        <div class="navbar-links">
            <RouterLink :to="{name: 'admin_dashboard'}" class="navbar-item">Dashboard</RouterLink>
            <RouterLink :to="{name: 'admin_users'}" class="navbar-item">Users</RouterLink>
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
.admin-navbar {
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