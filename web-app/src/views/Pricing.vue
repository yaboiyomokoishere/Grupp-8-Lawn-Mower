<template>
    <Navbar />

    <div class="pricing-table">
        <!-- Loop through the models and display them -->
        <ModelPricing v-for="model in modelsPrices" :key="model._id" :model="model" />
    </div>
</template>

<script setup>
import ModelPricing from '@/components/ModelPricing.vue';
import Navbar from '@/components/Navbar.vue';
import apiClient from '@/config/axios';
import { onMounted, ref } from 'vue';

const modelsPrices = ref([]);

onMounted(async () => {
    // Fetch all model prices.
    const response = await apiClient.get('/robot/getAllModelPrices');
    modelsPrices.value = response.data;
    //console.log(modelsPrices.value);
})

</script>

<style scoped>
.pricing-table{
    border: 1px solid black;
    border-radius: 10px;
    width: 75%;
    margin: 0 auto;
    padding: 20px;
}
</style>
