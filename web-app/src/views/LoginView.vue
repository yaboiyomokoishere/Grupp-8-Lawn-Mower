<template>
    <Navbar />
    <div class="login-signup-form-container">
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
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useToast } from "vue-toastification";


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
		// Setting withCredentials to true ensures the cookies are sent in the request.	
		const response = await axios.post('http://localhost:3001/api/user/login', formCredentials, {withCredentials: true});
		console.log('Successfully logged in!');

		// Store the access token in the local storage.
		localStorage.setItem('accessToken', response.data.accessToken);
		console.log('Access token stored in local storage.');

		// Decode the access token to extract the user's role.
		const decodedToken = jwtDecode(response.data.accessToken);
		const userRole = decodedToken.user.role;

		// Redirect the user to the their main page based on the role.
		if (userRole === 'customer') {
			console.log("User is a customer.");
			router.push({ name: 'customer_contracts' });
		} else if (userRole === 'admin') {
			console.log("User is an admin.");
			router.push({ name: 'admin_users' });
		} else if (userRole === 'technician') {
			console.log("User is a technician.");
			router.push({ name: 'technician_mowers' });
		} else {
			toast.error('Invalid email or password');
		}
	} catch (error) {
		toast.error('Invalid email or password');
		console.log('Error while logging in:', error);
	}
}
</script>


<style scoped>
form {
	padding: 20px;
	border-style: solid;
	border-color: #CCCCCC;
	border-width: 3px;
	border-radius: 5px;
}

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
	border: solid;
	border-radius: 5px;
	border-color: #CCCCCC;
}
</style>