<template>
    <div class="Log-Page">
        <h2>Customer Log</h2>
        <div class="log-info">
            <tr v-for=" log in customerLogs">
                <p><strong>action:</strong> {{ log.action }}</p>
                <p><strong>changed by:</strong> {{ log.changed_by }}</p>
                <p class="date"><strong>date:</strong> {{ log.date }}</p>
            </tr>
        </div>
    </div>

</template>

<script setup>
import apiClient from '@/config/axios';
import { reactive, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router';

//const logData = reactive ([{
  //  action: '',
  //  changed_by: '',
  //  date: ''
//}]);
const $route = useRoute();
const customerLogs = ref([]);

onMounted(async () => {
    try {
        const id = $route.params.id;
        console.log(id);
        const response = await apiClient.get(`/sla/getSlaLog?id=${id}`); 
        console.log(response.data);
        console.log(response.data.events[0]);
        for(let i = 0; i < response.data.events.length; i++) {
            //logData.action = response.data.events[i].action;
            //logData.changed_by = response.data.events[i].changed_by; 
            //logData.date = response.data.events[i].date.split('T')[0];
            let log = {
                action: response.data.events[i].action,
                changed_by: response.data.events[i].changed_by,
                date: response.data.events[i].date.split('T')[0]
            }
                //logData.action = response.data.events[i].action;
                //logData.changed_by = response.data.events[i].changed_by; 
                //logData.date = response.data.events[i].date.split('T')[0];
              customerLogs.value.push(log);
        }
        
    } catch (error) {
        console.log(error);
    }
});
</script>

<style>

.log-info {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
.date {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

</style>