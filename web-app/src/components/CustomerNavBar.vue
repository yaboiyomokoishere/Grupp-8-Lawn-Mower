<script setup>

import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const toast = useToast();
const router = useRouter();

const logout = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/user/logout');
    
    toast.success('Customer logged out successfully');
    router.push('./login');
  } catch (error) {
    //console.log('Error creating customer:', error);
    toast.error(error.message);
  }
}
</script>


<template>
    <div>
        <nav class="navbar">
            <div class="navbar-brand">
                <RouterLink to="/" class="navbar-item">Home</RouterLink>
            </div>
            <button id= "logout" @click="logout">Logout</button>
        </nav>
    </div>
</template>
  

  
 <style>
  .navbar {
    background-color: #4705ee;
    color: #0ce153;
    padding: 1em;
    text-align: left;
    display: flex;
    justify-content: space-between;
  }
  
  .navbar-brand {
    font-size: 1.5em;
    font-weight: bold;
  }
  
  .navbar-item {
    color: #0ce153;
    text-decoration: none;
  }
  
  .navbar-item:hover {
    color: #ccc;
  }

  button#logout {
    background: none;
    border: none;
    color: #0ce153;
    font-size: 1em;
    cursor: pointer;
  }

  button#logout:hover {
    color: #ccc;
  }
</style>
