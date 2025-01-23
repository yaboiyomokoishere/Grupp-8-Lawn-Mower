import './assets/main.css'
import router from './router';
import { createApp } from 'vue'
import App from './App.vue'
import Toast from "vue-toastification";
import 'vue-toastification/dist/index.css';
import './config/axios.js';


const app = createApp(App); // Creates the app instance 
app.use(router); // Registers the router for the app
app.use(Toast)

app.mount('#app'); 
