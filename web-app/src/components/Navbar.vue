<script setup>

</script>


<template>
    <div>
        <nav class="navbar">
            <div class="navbar-brand">
                <RouterLink to="/" class="navbar-item">Home</RouterLink>
            </div>
        </nav>
    </div>
</template>
  

  
  <style>
  .navbar {
    background-color: #4705ee;
    color: #0ce153;
    padding: 1em;
    text-align: left;
  }
  
  .navbar-brand {
    font-size: 1.5em;
    font-weight: bold;
  }
  
  .navbar-item {
    color: #0ce153;
    text-decoration: none;
  }
  
  .navbar-item:hover {
    color: #ccc;
  }
  </style>