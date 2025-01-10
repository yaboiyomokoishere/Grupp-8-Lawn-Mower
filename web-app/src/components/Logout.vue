<template>
    <button  id="logout" class="navbar-item" @click="logout">Logout</button>
</template>

<script setup>

import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const logout = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/user/logout', {}, { withCredentials: true });
    console.log(response);
    localStorage.removeItem('accessToken');
    router.push({name: 'login'});
  } catch (error) {
    console.log('Error creating customer:', error);
  }
}
</script>

<style>
#logout {
    font-size: 2rem;
    background-color: white;
    border: none;
    cursor: pointer;
    padding: 10px;
    margin: 0;
    font-family: inherit;  
}

 #logout {
    text-decoration: none;
    padding: 10px;
    color: black; /* Adjust color as needed */
}

#logout:hover {
  background-color: #f3f4f6;
  color: #2563eb;
}
</style>