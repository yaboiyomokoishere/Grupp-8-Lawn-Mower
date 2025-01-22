<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="start">Start Date:</label>
      <flat-pickr
        id="start"
        v-model="startDate"
        :config="config"
        @on-change="validateDateRange"
      />
    </div>

    <div>
      <label for="end">End Date:</label>
      <flat-pickr
        id="end"
        v-model="endDate"
        :config="config"
        @on-change="validateDateRange"
      />
    </div>

    <p v-if="dateError" style="color: red;">{{ dateError }}</p>
    <button type="submit">Submit</button>
  </form>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  components: { flatPickr },
  data() {
    return {
      startDate: null,
      endDate: null,
      dateError: "",
      config: {
        dateFormat: "Y-m-d",
      },
    };
  },
  methods: {
    validateDateRange(selectedDates, dateStr, instance) {
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        if (start > end) {
          this.dateError = "Start date cannot be after end date.";
        } else {
          this.dateError = "";
        }
      }
    },
    submitForm() {
      this.validateDateRange();
      if (this.dateError) return;
      console.log("Form submitted with:", this.startDate, this.endDate);
    },
  },
};
</script>
