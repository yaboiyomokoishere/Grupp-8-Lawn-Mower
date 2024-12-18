<script setup>

</script>


<template>
    <div class="navbar">
        <nav >
            <div class="navbar-brand">
                <RouterLink to="/" class="navbar-item">Home</RouterLink>
            </div>
        </nav>
    </div>
</template>
  

  
  <style>
  .navbar {
    background-color: #010805;
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
    color: #4705ee;
  }
  </style>
