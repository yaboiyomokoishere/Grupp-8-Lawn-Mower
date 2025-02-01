<template>


</template>

<script setup>
import apiClient from '@/config/axios';
import { reactive, onMounted } from 'vue';
import { RouterLink } from 'vue-router';


const logData = reactive ([{
    action: '',
    changed_by: '',
    date: ''
}])

onMounted(async () => {
    try {
        const id = '679362218d2782827ddf1392';
        console.log(id);
        const response = await apiClient.get(`/sla/getSlaLog?id=${id}`); 
        console.log(response.data.result);
        
        slaDetails.address = response.data.result.address;
        slaDetails.start_date = response.data.result.start_date.split('T')[0];
        slaDetails.end_date = response.data.result.end_date.split('T')[0];
        slaDetails.grass_height = response.data.result.grass_height;
        slaDetails.working_area = response.data.result.working_area;
        slaDetails.status = response.data.result.status;
        slaDetails.price = response.data.result.price;

    } catch (error) {
        console.log(error);
    }
});
</script>

<style>



</style>