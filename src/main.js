import { createApp } from 'vue'
import App from './App.vue'

// Connect routing
import router from "router";

// Connect global styles
import "scss";

// Connect Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App)
      app.use(router)
      app.mount('#app');
