<script setup>
import Navbar from '@/components/Navbar.vue';
import router from '@/router';
</script>

<template>
    <div class="app-container">
        <Navbar />
        <div class="home-container">
            <div class="flex-section">
                <div class="text-content">
                    <h1>Welcome</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam 
                        condimentum sapien vel libero posuere, in finibus nisi tempor. 
                        Fusce ullamcorper eros in ligula faucibus dignissim. Vestibulum 
                        ante ipsum primis in faucibus orci luctus et ultrices posuere 
                        cubilia curae; Donec varius felis ac arcu tincidunt mattis.
                    </p>
                    <button class="sign-up-button" @click="router.push({name:'signup'})">Sign Up</button>
                </div>
                <div class="image-container">
                    <img src="https://i.imgur.com/zYwBn4B.jpeg" alt="Featured Image" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.flex-section {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
}

.text-content {
    flex: 1;
}

.image-container {
    flex: 1;
    margin-top:20px;
}

img {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

p {
    line-height: 1.6;
    margin-bottom: 1rem;
}
</style>