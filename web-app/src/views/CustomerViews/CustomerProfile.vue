<template>
  <div class="user-page-container">
    <CustomerNavBar />
    <div class="customer-content">
      <h1>Profile</h1>  <div class="form-container">
      <form @submit.prevent="handleSubmit">
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
            <span v-if="v$.postalCode.$error" class="error">Postal code is required.</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>New Password</label>
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
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, reactive} from 'vue';
import apiClient from '@/config/axios'; // Use your configured Axios instance
import CustomerNavBar from '@/components/CustomerNavBar.vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs, maxLength } from '@vuelidate/validators'
// Reactive state variables
const loading = ref(true); // Loading state
const error = ref(null); // Error message

// Form validation 
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

// Fetch data on component mount
const fetchCustomerData = async () => {
  try {
    // FETCHING DATA NOT DONE YET
    const response = await apiClient.get('/user/getCustomer');
    console.log(response.data);
    //customerData.value = response.data; // Assign the API response to `customerData`
    formData.firstName = response.data.first_name;
    formData.lastName = response.data.last_name;
    formData.userEmail = response.data.email;
    formData.address = response.data.address;
    formData.phoneNumber = response.data.phone_number;
    formData.postalCode = response.data.postal_code;
  } catch (err) {
    error.value = 'Failed to fetch customer data. Please try again later.';
    console.error(err);
  } finally {
    loading.value = false; // Turn off loading state
  }
};



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

// Update customer data
const handleUpdate = async () => {
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
      // API endpoint not implemented yet
      //const response = await axios.post('http://localhost:3001/api/user/updateCustomer', newCustomer);
      console.log(response.data); // Log the response data obtained from the backend
      toast.success('Data updated successfully');
      location.reload(); // Refresh the page
    } catch (error) {
      console.log('Error while updating customer:', error);
      toast.error(error.message);
    }
  }
}


// Fetch data when the component is mounted
onMounted(() => {
  fetchCustomerData();
});

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
  margin-bottom: 10px;
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