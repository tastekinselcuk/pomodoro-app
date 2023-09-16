import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

// Set the base URL for Spring Boot backend
axios.defaults.baseURL = 'http://localhost:8085'; // Replace with backend URL

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@/assets/pomodoroStyle.css';

createApp(App).mount('#app')
