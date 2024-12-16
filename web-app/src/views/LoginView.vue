<script setup>
import Navbar from '@/components/Navbar.vue';

import router from '@/router';
import {reactive} from 'vue';
import axios from 'axios';
import {useToast} from "vue-toastification";


const credentials = reactive({
  userEmail: '',
  password: ''
})

const toast = useToast();

const handleSubmit = async () => {
  const newCustomer = {
  email: credentials.userEmail,
  password: credentials.password
  };
  try {
    const response = await axios.post('http://localhost:3001/api/user/login', newCustomer);
    console.log(response.data); // Log the response data obtained from the backend
    toast.success('Customer created successfully');
    
    // Save the 

    //router.push('../login'); // Redirect to the login page after sucessful signup
  } catch (error) {
    console.log('Error creating customer:', error);
    toast.error(error.message);
  }
}
</script>


<template>
    <Navbar />
    <div>
      <form @submit.prevent="CustomerLogin">
        <label>
          Email
          <input type="email" v-model="userEmail" />
        </label>
        <label>
          Password
          <input type="password" v-model="password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
</template>


<style scoped>
button,
input {
  display: block;
  margin-bottom: 10px;
}

#alert {
  color: red;
  margin-bottom: 10px;
}
</style>