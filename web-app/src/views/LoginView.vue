<template>
    <Navbar />
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <legend>Login</legend>
        <label>Email</label>
          <input type="email" id="userEmail" v-model="loginCredentials.userEmail" />
        <label>Password</label>
          <input type="password" id="password" v-model="loginCredentials.password" />
        <button type="submit">Login</button>
      </form>
    </div>
</template>



<script setup>
import Navbar from '@/components/Navbar.vue';
import router from '@/router';
import {reactive} from 'vue';
import {useToast} from "vue-toastification";
import apiClient from '@/config/axios';
import { jwtDecode } from "jwt-decode";


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
    const response = await apiClient.post('/user/login', formCredentials,{
    withCredentials: true});
    //console.log(response); // Log the response data obtained from the backend, see fields in chrome dev tools
    // Store the access token in the local storage
    localStorage.setItem('accessToken', response.data.accessToken);

    //toast.success('Customer logged in successfully');
    
    // Decode the access token to extract the user's role
    const decodedToken = jwtDecode(response.data.accessToken);
    const userRole = decodedToken.user.role;

    // Redirect users based on their role
    if (userRole === 'customer') {
      //console.log("customer");
      router.push({ name: 'customer_dashboard' });
    } else if (userRole === 'admin') {
      //console.log("admin");
      router.push({ name: 'admin_dashboard' });
    } else {
      toast.error('invalid role');
    }
  } catch (error) {
    console.log('Error creating customer:', error);
    toast.error('Invalid email or password');
  }
}
</script>


<style scoped>

button {
  width: 100%;
}
button, input {
  font-size: 1.2rem;
  padding:10px;
  display: block;
  margin-bottom: 10px;
}

button {
  width: 100%;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>