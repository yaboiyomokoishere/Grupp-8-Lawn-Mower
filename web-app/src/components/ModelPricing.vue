<template>
  <table>
    <thead>
      <tr>
        <th>Model</th>
        <th>Heights</th>
        <th>Max Area</th>
        <th>kr/kvm</th>
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
                <td>{{ heightPrice.height }}</td>
                <td>{{ heightPrice.price === 0 ? 'Free' : heightPrice.price }}</td>
              </tr>
            </tbody>
          </table>
        </td>
        <td>{{ model.max_area }}</td>
        <td>{{ model.price_per_square_meter }}</td>
        <td>{{ model.installation }}</td>
        <td>{{ model.robot_daily_rent }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps(['model']);
console.log(props.model);

</script>

<style scoped>  
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: #4CAF50;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
</style>
