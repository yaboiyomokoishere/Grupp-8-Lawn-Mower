<template>
    <Navbar />
    <div>
      <form @submit.prevent="handleSubmit">
        <h2>Sign up</h2>
        <label>
          First name
          <input type="text" id="name" name="name" v-model="formData.firstName"  required />
        </label>
        <label>
          Email address
          <input type="email" id="userEmail" v-model="formData.userEmail" />
        </label>
        <label>
          Password
          <input type="password" id="password" v-model="formData.password" />
        </label>
        <button type="submit">Sign up</button>
      </form>
    </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import router from '@/router';
import {reactive} from 'vue';
import axios from 'axios';
import {useToast} from "vue-toastification";


const formData = reactive({
  firstName: '',
  userEmail: '',
  password: ''
})

const toast = useToast();

const handleSubmit = async () => {
  const newCustomer = {
  username: formData.firstName, // Map firstName to username
  email: formData.userEmail,
  password: formData.password
  };
  console.log(newCustomer); // Shows the data fetched from the form
  try {
    const response = await axios.post('http://localhost:3001/api/user/register', newCustomer);
    console.log(response.data); // Log the response data obtained from the backend
    toast.success('Customer created successfully');
    
    router.push('../login'); // Redirect to the login page after sucessful signup
  } catch (error) {
    console.log('Error creating customer:', error);
    toast.error(error.message);
  }
}
</script>

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