<script setup>
import Navbar from '@/components/Navbar.vue';

import axios from 'axios';
import {useToast} from "vue-toastification";

const toast = useToast();

const logout = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/user/logout', {
      withCredentials: true
    });
    console.log(document.cookie);
    //toast.success('Customer logged out successfully');
  } catch (error) {
    console.log('Error creating customer:', error);
    //toast.error(error.message);
  }
}

</script>


<template>
    <Navbar />
    <br />
    <RouterLink to="/login">Login</RouterLink>
    <br />
    <RouterLink to="/signup">Sign Up</RouterLink>

    <button @click="logout">Logout</button>
</template>