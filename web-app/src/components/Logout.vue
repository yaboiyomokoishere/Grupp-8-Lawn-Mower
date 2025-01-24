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
    border: none;
    padding: 10px;
    margin: 0;
    font-family: inherit;  
}

</style>