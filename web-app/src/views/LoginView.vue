<script setup>
import Navbar from '@/components/Navbar.vue';
</script>


<template>
    <Navbar />
    <div>
      <form @submit.prevent="CustomerLogin">
        <label>
          Email
          <input type="email" v-model="userEmail" />
        </label>
        <label>
          Password
          <input type="password" v-model="password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
</template>


<style scoped>
button,
input {
  display: block;
  margin-bottom: 10px;
}

#alert {
  color: red;
  margin-bottom: 10px;
}
</style>