<template>
  <table class="model-pricing-table">
    <thead>
      <tr>
        <th>Model</th>
        <th>Heights</th>
        <th>Max Area</th>
        <th>Price/m²</th>
        <th>Installation</th>
        <th>Robot Daily Rent</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ model.model }}</td>
        <td>
          <table>
            <tbody>
              <tr v-for="heightPrice in model.height_prices" :key="heightPrice.height">
                <td>{{ heightPrice.height }} cm:</td>
                <td>{{ heightPrice.price === 0 ? 'Free' : heightPrice.price + ' kr' }} </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td>{{ model.max_area }} m²</td>
        <td>{{ model.price_per_square_meter }} kr</td>
        <td>{{ model.installation }} kr</td>
        <td>{{ model.robot_daily_rent }}  kr</td>
      </tr>
    </tbody>
  </table>
  <br>
</template>

<script setup>
const props = defineProps(['model']);
//console.log(props.model);

</script>

<style scoped>  
  .model-pricing-table {
    border-collapse: collapse;
    background-color: white;
    border: 1px solid #cbd5e0;
    border-radius: 0.3rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: 100%;
    padding: 20px;
    font-size: 1.2rem;
  }

  th, td {
    text-align: center;
    padding: 5px;
  }

  th {
    background-color: #4CAF50;
    color: white;
  }
</style>
