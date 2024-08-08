import './assets/main.css'
import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faTag, faChevronRight, faUser, faLock, faUserCircle, faUserAstronaut, faCreditCard, faCheckCircle, faTruck, faStar } from '@fortawesome/free-solid-svg-icons';

library.add(faChevronLeft, faTag, faChevronRight, faUser, faLock, faUserCircle, faUserAstronaut, faCreditCard, faCheckCircle, faTruck, faStar)

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount("#app");