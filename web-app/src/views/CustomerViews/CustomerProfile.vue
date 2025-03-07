<template>
	<div class="user-page-container">
		<CustomerNavBar />
		<div class="customer-content">
			<h1 >Profile</h1>  
			<div class="form-container">
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

					<span v-if="emailError" class="error" >
							{{ emailError }}
					</span>
					<button type="submit">Update</button>
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
import { useToast } from "vue-toastification";

const toast = useToast();

// Reactive state variables
const error = ref(null); // Error message
const emailError = ref(null);

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


const fetchCustomerData = async () => {
	try {
		console.log("Loading customer data...")
		const response = await apiClient.get('/user/getCustomer');
		if (response.status == 200){
			formData.firstName = response.data.first_name;
			formData.lastName = response.data.last_name;
			formData.userEmail = response.data.email;
			formData.address = response.data.customer_details.address;
			formData.phoneNumber = response.data.customer_details.phone_number;
			formData.postalCode = response.data.customer_details.postal_code;
			console.log("Data loaded successfully!")
		}
	} catch (err) {
		error.value = 'Failed to fetch customer data.';
		console.error(err);
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
	password: { required: computed(() => !!formData.confirmPassword), minLength: minLength(8) },
	confirmPassword: { required: computed(() => !!formData.password), sameAsPassword: sameAs(formData.password) }  
}))

const v$ = useVuelidate(rules, formData);

// Update customer data
const handleSubmit = async () => {
	const result = await v$.value.$validate();

	if (result) {
		formData.phoneNumber = parseInt(formData.phoneNumber);
		formData.postalCode = parseInt(formData.postalCode);
		const newData = {
			first_name: formData.firstName,
			last_name: formData.lastName,
			email: formData.userEmail,
			address: formData.address,
			phone_number: formData.phoneNumber,
			postal_code: formData.postalCode,
			password: formData.password
		};

		try {
			const response = await apiClient.put('http://localhost:3001/api/user/updateCustomer', newData);
			if (response.status === 200) {
				fetchCustomerData();
				toast.success('Your information has been updated successfully');
			} 
		} catch (err) {
			if (err.response && err.response.status === 400) {
				emailError.value = err.response.data.message; 
			} 
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
	display: flex;
}

form {
	padding: 20px;
	border-style: solid;
	border-color: #CCCCCC;
	border-width: 3px;
	border-radius: 5px;
}

.form-row {
	display: flex;
	gap: 20px;
	margin-bottom: 20px;
}

input, label {
	display: block;
}

button, input {
	font-size: 1.2rem;
	padding: 10px;
	box-sizing: border-box;
}

button {
	width: 100%;
	margin: 10px auto;
	border: solid;
	border-radius: 5px;
	border-color: #CCCCCC;
}
</style>