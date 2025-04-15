import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import vuetify from "./plugins/vuetify.js";
import './assets/styles.css'
createApp(App).use(vuetify).use(router).mount("#app");

