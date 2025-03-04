<template>
	<div class="user-page-container">
		<CustomerNavBar />
		<div class="customer-content">
			<h1>Service Level Agreement</h1>
			<div class="form-container">
				<form @submit.prevent="handleSubmit">
					<div class="form-row">
						<div class="form-group">
						<label for="address">Address</label><br>
						<input type="text" name="address" id="address" v-model="formData.address" required>
						</div>
						<div class="form-group">
							<label for="robot_model">Robot Model</label><br>
							<select name="robot_model" id="robot_model" v-model="formData.robot_model" required>
								<option disabled value="">Select a model</option>
								<option v-for="model in models" :key="model._id" :value="model.model">
									{{ model.model }}
								</option>
							</select>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="start_date">Start Date</label><br>
							<flatPickr
								v-model="formData.start_date"
								:config="startDateConfig"
								id="start_date"
								placeholder="Click to select a date"
							/>
						</div>
						<div class="form-group">
							<label for="end_date">End Date</label><br>
							<flatPickr
								v-model="formData.end_date"
								:config="endDateConfig"
								id="end_date"
								placeholder="Click to select a date"
							/>
						</div>
					</div>
				
					<template v-if="formData.robot_model">
						<div class="form-row">
							<div class="form-group">
								<label for="working_area">Working Area (m²)</label><br>
								<input 
								type="number" 
								name="working_area" 
								id="working_area" 
								v-model="formData.working_area"
								min="500"
								:max="selectedModel.max_area"
								required 
								/>
								<span v-if="selectedModel">Max: {{ selectedModel.max_area }} m²</span>
							</div>
							<div class="form-group">
								<label for="grass_height">Grass Height (cm)</label><br>
								<select name="grass_height" id="grass_height" v-model="formData.grass_height" required>
									<option disabled value="">Select a height</option>
									<option v-for="height in selectedModel?.height_prices" :key="height.height" :value="height.height">
										{{ height.height }}
									</option>
								</select>
							</div>
						</div>
					</template>
					<button type="submit">Order</button>
				</form>
			</div>        
		</div>
	</div>
</template>
  
<script setup>
import CustomerNavBar from '@/components/CustomerNavBar.vue';
import { reactive, computed, watch, ref, onMounted } from 'vue';
import apiClient from '@/config/axios';
import { required} from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import router from '@/router';
  
const formData = reactive({
	address: '',
	start_date: '',
	end_date: '',
	robot_model: '',
	working_area: '',
	grass_height: ''
});
  
const models = ref([]);
const selectedModel = computed(() => 
	models.value.find(m => m.model === formData.robot_model)
);

// Validation
const rules = computed(() => ({
	address: { required },
	start_date: { required },
	end_date: { required },
	robot_model: { required },
	working_area: { 
		required,
		maxValue: (value) => !formData.robot_model || value <= (selectedModel.value?.max_area || 0)
	},
	grass_height: { 
		required: !!formData.robot_model
	}
}));
  
const v$ = useVuelidate(rules, formData);
  
const startDateConfig = {
	dateFormat: "Y-m-d",
	minDate: new Date()
};
  
const endDateConfig = computed(() => ({
	dateFormat: "Y-m-d",
	minDate: formData.start_date ? 
		new Date(new Date(formData.start_date).setDate(new Date(formData.start_date).getDate() + 1)) : 
		new Date()
}));
  
watch(() => formData.start_date, (newStart) => {
	if (formData.end_date && new Date(formData.end_date) <= new Date(newStart)) {
		formData.end_date = '';
	}
});
  
const handleSubmit = async () => {
	const result = await v$.value.$validate();
	if (!result) return;

	const newSla = {
		address: formData.address,
		start_date: formData.start_date,
		end_date: formData.end_date,
		working_area: Number(formData.working_area),
		grass_height: Number(formData.grass_height),
		robot_model: formData.robot_model
	};
	try {
		localStorage.setItem('newOrder', JSON.stringify(newSla));
		router.push({ name: 'confirm_order' });	
	} catch (error) {
		console.error(error);
	}
};
  
const fetchModels = async () => {
	try {
		const response = await apiClient.get('/user/getPriceLists');
		models.value = response.data;
	} catch (error) {
		console.error('Error fetching models:', error);
	}
};

onMounted( async () =>{
	await fetchModels();
})
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

.form-group {
	flex: 1;
}

input, label, select {
	display: block;
}

button, input, select {
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