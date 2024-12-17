<script setup>
import Navbar from '@/components/Navbar.vue';
import router from '@/router';
import {reactive} from 'vue';
import axios from 'axios';
import {useToast} from "vue-toastification";


const loginCredentials = reactive({
  userEmail: '',
  password: ''
})

const toast = useToast();

const handleSubmit = async () => {
  const formCredentials = {
  email: loginCredentials.userEmail,
  password: loginCredentials.password
  };

  try {
    const response = await axios.post('http://localhost:3001/api/user/login', formCredentials,{
      withCredentials: true
    });
    console.log(response.data); // Log the response data obtained from the backend
    toast.success('Customer created successfully');

    router.push('../CustomerView'); // Redirect to user dashboard aka CustomerView.vue
  } catch (error) {
    console.log('Error creating customer:', error);
    toast.error(error.message);
  }
}
</script>


<template>
    <Navbar />
    <div>
      <form @submit.prevent="handleSubmit">
        <h2>Login</h2>
        <label>
          Email
          <input type="email" id="userEmail" v-model="loginCredentials.userEmail" />
        </label>
        <label>
          Password
          <input type="password" id="password" v-model="loginCredentials.password" />
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