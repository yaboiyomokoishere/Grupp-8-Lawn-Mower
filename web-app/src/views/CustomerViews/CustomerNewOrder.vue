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
          <div class="form-row">
            <div class="form-group">
              <label for="working_area">Working Area (kvm)</label><br>
              <select name="working_area" id="working_area" v-model="formData.working_area" required>
                <option disabled value="">Select an area</option>
                <option v-for="area in areaPrices"  :value="area.area">
                  {{ area.area }} kvm
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="grass_height">Grass Height (cm)</label><br>
              <select name="grass_height" id="grass_height" v-model="formData.grass_height" required>
                <option disabled value="">Select a height</option>
                <option v-for="height in heightPrices"  :value="height.height">
                  {{ height.height }} cm
                </option>
              </select>
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
import { reactive, computed, watch, onMounted } from 'vue';
import apiClient from '@/config/axios'; 
import { required, minLength, maxLength } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import router from '@/router';

const formData = reactive({
  address: '',
  start_date: '',
  end_date: '',
  working_area: '',
  grass_height: ''
});

// Reactive variables to store height and area options
const heightPrices = reactive([]);
const areaPrices = reactive([]);

const rules = computed(() => ({
  address: { required },
  start_date: { required },
  end_date: { required },
  working_area: { 
    required  
  },
  grass_height: { 
    required
  }
}));

const v$ = useVuelidate(rules, formData);

const startDateConfig = {
  dateFormat: "Y-m-d",
  minDate: new Date() // Prevent past dates
};

const endDateConfig = computed(() => {
  // The minimum date is at least one day after the chosen start date
  if (formData.start_date) {
    const start = new Date(formData.start_date);
    const minEndDate = new Date(start);
    minEndDate.setDate(start.getDate() + 1);
    return {
      dateFormat: "Y-m-d",
      minDate: minEndDate
    };
  } else {
    return {
      dateFormat: "Y-m-d",
      minDate: new Date() 
    };
  }
});

// If the start date changes and the chosen end date becomes invalid
watch(() => formData.start_date,
  (newStartDate) => {
    if (formData.end_date) { // If the end date is already chosen
      const start = new Date(newStartDate);
      const end = new Date(formData.end_date);
      if (end <= start) {
        formData.end_date = '';
      }
    }
  }
);

const handleSubmit = async () => {
  const result = await v$.value.$validate();

  if (result) {
    //console.log(formData.grass_height)
    formData.working_area = parseInt(formData.working_area);
    formData.grass_height = parseFloat(formData.grass_height);
    const newSla = {
      address: formData.address,
      start_date: formData.start_date,
      end_date: formData.end_date,
      working_area: formData.working_area,
      grass_height: formData.grass_height
    };
    //console.log(newSla);
    try {
      // const slaStore = useSlaStore();
      // slaStore.addSla(newSla);
      localStorage.setItem('newOrder', JSON.stringify(newSla))
      //console.log(localStorage.getItem('newOrder'))
      // Forward the newSla object to the CustomerConfirmOrder page upon pressing the button
      router.push({ name: 'confirm_order'});
    } catch (error) {
      console.error(error);
    }
  }
}

onMounted(async () => {
  try{
    const alternatives = await apiClient.get('/sla/getAlternatives');
    //console.log(alternatives.data);
    
    // Extract the height and area objects as arrays
    heightPrices.push(...alternatives.data.height_prices);
    areaPrices.push(...alternatives.data.area_prices);
    
  } catch (error) {
    console.log(error);
  }
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
