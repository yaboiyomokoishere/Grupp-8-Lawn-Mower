<template>
    <div class="tech-page-container">
        <TechNavBar/>
        <div class="tech-content">
            <h1>Report</h1>
            <div class="go-back" >
                <RouterLink :to="{name: 'technician_reports'}">
                    <button class="go-back-link">Go Back</button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import TechNavBar from '@/components/TechNavBar.vue';

</script>