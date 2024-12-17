<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const toast = useToast();
const router = useRouter();

const user = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/user/current');
    user.value = response.data;
    isLoading.value = false;
  } catch (err) {
    error.value = err;
    isLoading.value = false;
    toast.error('Please log in');
    router.push('/login'); // Redirect to login if not authenticated
  }
});
</script>


<template>
  <div>
    <h1>Customer View</h1>
    <p>This page is private and only accessible to logged-in users.</p>
  </div>
</template>
