import './assets/main.css'
import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faTag, faChevronRight, faUser, faLock, faUserCircle, faUserAstronaut, faCreditCard, faCircleCheck, faTruckFast, faStar, faCheck, faExclamationTriangle, faCartShopping, faCircleChevronLeft, faCircleChevronRight, faTriangleExclamation, faCircleExclamation, faExclamation, faTrash } from '@fortawesome/free-solid-svg-icons';


library.add(faChevronLeft, faTag, faChevronRight, faUser, faLock, faUserCircle, faUserAstronaut, faCreditCard, faCircleCheck, faTruckFast, faStar, faCheck, faExclamationTriangle, faCartShopping, faCircleChevronLeft, faCircleChevronRight, faTriangleExclamation, faCircleExclamation, faExclamation, faTrash )

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount("#app");