<template></template>
<!-- <template>

    <div class="tech-page-container">
        <TechNavBar />
        <div class="robot-info">
            <h1>Edit Mower</h1>
            <p><strong>Model:</strong> {{ model }}</p>
            <p><strong>Serialnumber:</strong> {{ serial_number }}</p>
            <p><strong>Last maintenance:</strong> {{ last_maintenance_date }}</p>
            <div class="form-group">
                <label for="status">Status </label><br>
                <select name="status" id="status" required>
                    <option v-for="status in formData.status">
                        {{ status.status }}
                    </option>
                </select>
            </div>
            <button type="submit">Update</button>
        </form>
           
        </div>
        <div class="go-back">
        <RouterLink :to="{name: 'technician_mowers'}"> 
                    <button class="go-back-link">Go Back</button> 
                </RouterLink>
            </div>
    </div>



</template>

<script setup>

import TechNavBar from '@/components/TechNavBar.vue';
import apiClient from '@/config/axios';
import { onMounted, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import {useRoute} from 'vue-router';
const formData = reactive({
    status: '',
    last_maintenance_date: Date.now()
});

const rules = computed(() => ({
    status: { required }
}));    
const v$ = useVuelidate(rules, formData);

async function handleSubmit() {
    const mowerData = {
        status: formData.status,
        last_maintenance_date: formData.last_maintenance_date

    }
    const response = await apiClient.put('/robot/updateRobot', mowerData);
}

</script> -->