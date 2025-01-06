<template>
  <Navbar />
  <div class="form-container">
    <form @submit.prevent="handleSubmit">
      <legend>Sign up</legend>

      <div class="form-row">
        <div class="form-group">
          <label>First name</label>
          <input type="text" id="first_name" v-model="formData.firstName" />
          <span v-if="v$.firstName.$error" class="error">Only letters are allowed.</span>
        </div>

        <div class="form-group">
          <label>Last name</label>
          <input type="text" id="last_name" v-model="formData.lastName" />
          <span v-if="v$.lastName.$error" class="error">Only letters are allowed.</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Email address</label>
          <input type="email" id="userEmail" v-model="formData.userEmail" />
          <span v-if="v$.userEmail.$error" class="error">
            {{ v$.userEmail.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <label>Address</label>
          <input type="text" id="address" v-model="formData.address" />
          <span v-if="v$.address.$error" class="error">Address is required.</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Phone number</label>
          <input type="tel" id="phone" v-model="formData.phoneNumber" />
          <span v-if="v$.phoneNumber.$error" class="error">
            Phone number must be 10 digits.
          </span>
        </div>

        <div class="form-group">
          <label>Postal code</label>
          <input type="text" id="postalCode" v-model="formData.postalCode" />
          <span v-if="v$.postalCode.$error" class="error">Postal code must be 5 digits.</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="password" v-model="formData.password" />
          <span v-if="v$.password.$error" class="error">
            {{ v$.password.$errors[0].$message }}
          </span>
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="formData.confirmPassword"
          />
          <span v-if="v$.confirmPassword.$error" class="error">
            Passwords must match.
          </span>
        </div>
      </div>

      <button type="submit">Sign up</button>
    </form>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import router from '@/router';
import {reactive, computed} from 'vue';
import axios from 'axios';
import {useToast} from "vue-toastification";
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs, maxLength } from '@vuelidate/validators'


const toast = useToast();

const formData = reactive({
  firstName: '',
  lastName: '',
  userEmail: '',
  address: '',
  phoneNumber: '',
  postalCode: '',
  password: '',
  confirmPassword: ''
})


const alphaOnly = (value) => /^[a-zA-Z]+$/i.test(value); // Only letters 
const alphaNum = value => /^[0-9]+$/.test(value) // Only numbers

const rules = computed(() => ({ 
  firstName: { required, alphaOnly },
  lastName: { required, alphaOnly },
  userEmail: { required, email },
  address: { required },
  phoneNumber: { required, alphaNum, minLength: minLength(10), maxLength: maxLength(10) },
  postalCode: { required, alphaNum, minLength: minLength(5), maxLength: maxLength(5) },
  password: { required, minLength: minLength(8) },
  confirmPassword: { required, sameAsPassword: sameAs(formData.password) }  
}))

const v$ = useVuelidate(rules, formData);

const handleSubmit = async () => {
  const result = await v$.value.$validate();
  
  //console.log(result);
  if (result) {
    formData.phoneNumber = parseInt(formData.phoneNumber);
    formData.postalCode = parseInt(formData.postalCode);
    const newCustomer = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.userEmail,
      address: formData.address,
      phone: formData.phoneNumber,
      postalCode: formData.postalCode,
      password: formData.password
    };

    try {
      //console.log(newCustomer);
      const response = await axios.post('http://localhost:3001/api/user/register', newCustomer);
      console.log(response.data); // Log the response data obtained from the backend
      toast.success('Customer created successfully');
      
      router.push({name: 'login'}); // Redirect to the login page after sucessful signup
    } catch (error) {
      console.log('Error creating customer:', error);
      toast.error(error.message);
    }
  }
}
</script>

<style scoped>

.form-container {
  max-width: 600px;
  margin: auto;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

input {
  width: 100%;
  font-size: 1.2rem;
  padding: 10px;
  box-sizing: border-box;
}

button {
  width: 100%;
  font-size: 1.2rem;
  padding: 10px;
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