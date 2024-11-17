import { createApp } from 'vue'
import 'scss/app.scss'
import App from './App.vue'

// Connection routers
import router from "/router";

// Connection Bootstrap css and Bootstrap js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Connection Swiper
import 'swiper/swiper-bundle.css';

// Connection Moment js
import moment from 'moment';

// Connection Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas, faPhone, faVolumeUp, faDeleteLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

library.add( faPhone, faVolumeUp, faDeleteLeft, faTrash )

// createApp(App).mount('#app')
const app = createApp(App)
      app.use(router)
      app.use(moment)
      app.component('font-awesome-icon', FontAwesomeIcon)
      app.mount('#app')
