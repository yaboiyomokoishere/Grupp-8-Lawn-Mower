<template>
    <Navbar />
    <div id="app">
      <form @submit.prevent="handleSubmit">
        <h2>Sign up</h2>
        <label>
          First name
          <input type="text" id="firstName" v-model="firstName" />
        </label>
        <label>
          Email address
          <input type="email" id="userEmail" v-model="userEmail" />
        </label>
        <label>
          Password
          <input type="password" id="password" v-model="password" />
        </label>
        <button type="submit">Sign up</button>
      </form>
    </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
//import router from '@/router';
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
    firstName: formData.firstName,
    userEmail: formData.userEmail,
    password: formData.password
  };

  try {
    const response = await axios.post('http://localhost:3001/api/user/register', newCustomer);
    console.log(newCustomer);
    //console.log(response.data); // Log the response data obtained from the backend
    toast.success('Customer created successfully');
    // router.push('/login'); // Redirect to the login page after successful signup
  } catch (error) {
    console.log('Error creating customer:', error);
    //toast.error(error.message);
  }
  
}


/*
// Initialize Userfront
Userfront.init("demo1234");

export default {
  data() {
    return {
      email: "",
      accountName: "",
      password: "",
      passwordVerify: "",
      alert: ""
    };
  },
  methods: {
    // Sign up with the form's email and password
    signupWithPassword() {
      // Reset the alert to empty
      this.alert = "";
      // Verify that the passwords match
      if (this.password !== this.passwordVerify) {
        this.alert = "Passwords must match";
        return;
      }
      // Call Userfront.signup()
      Userfront.signup({
        method: "password",
        email: this.email,
        password: this.password,
        data: {
          accountName: this.accountName
        }
      }).catch((error) => {
        this.alert = error.message;
      });
    },
    // Sign up with SSO (google)
    signupWithSSO() {
      Userfront.signup({ method: "google" });
    }
  }
};
*/
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