<template>
    <div class="user-page-container">
      <CustomerNavBar />
      <div class="customer-content">
        <h1>Service Level Agreement</h1>
        <div class="form-container">
          <form @submit.prevent="handleSubmit" >
            <div class="form-row">
              <div class="form-group">
                <label for="address">Address</label><br>
                <input type="text" name="address" id="address" v-model="formData.address" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="start_date">Start Date</label><br>
                <input type="date" name="start_date" id="start_date" v-model="formData.start_date" required>
              </div>
              <div class="form-group">
                <label for="end_date">End Date</label><br>
                <input type="date" name="end_date" id="end_date" v-model="formData.end_date" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="working_area">Working Area (m^2)</label><br>
                <input type="text" name="working_area" id="working_area" v-model="formData.working_area" required>
              </div>
              <div class="form-group">
                <label for="grass_height">Grass Height (cm)</label><br>
                <input type="number" name="grass_height" id="grass_height" v-model="formData.grass_height" required>
              </div>
            </div>
            <button type="submit">Order</button>
          </form>
        </div>        
      </div>
    </div>
</template>
  
<script setup>
import CustomerNavBar from '@/components/CustomerNavBar.vue';
import { reactive, computed} from 'vue';
import apiClient from '@/config/axios'; 
import { required, email, minLength, sameAs, maxLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import flatPickr from "vue-flatpickr-component";

const formData = reactive({
  address: '',
  start_date: '',
  end_date: '',
  working_area: '',
  grass_height: ''
})

const rules= computed(() => ({
  working_area: { minValue: minLength(1), maxValue: maxLength(5000) }, 
  grass_height: { minValue: minLength(1), maxValue: maxLength(30) }
}))

const v$ = useVuelidate(rules, formData)

const handleSubmit = async () => {
  const result = await v$.value.$validate();

  if (result) {
    formData.working_area= parseInt(formData.working_area);
    formData.grass_height= parseInt(formData.grass_height);
    const newSla = {
      address: formData.address,
      start_date: formData.start_date,
      end_date: formData.end_date,
      working_area: formData.working_area,
      grass_height: formData.grass_height
    }

    try {
    // Create the SLA
    //const response = await apiClient.post('/createSla', newSla);
    //console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
}

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
