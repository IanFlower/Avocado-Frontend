import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import StudentHome from "./views/StudentHome.vue";
import AdminHome from "./views/AdminHome.vue";
import AdminManageEvents from "./views/AdminManageEvents.vue";
// import HomePage from "./views/HomePage.vue";
// import CreateResume from "./views/CreateResume.vue";
// import AdminPage from "./components/AdminPage.vue"
// import AdminView from "./components/AdminView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: "/AdminHome", 
      alias: "/AdminHome",
      name: "AdminHome", 
      component: AdminHome
    },
    { 
      path: "/AdminManageEvents", 
      alias: "/AdminManageEvents",
      name: "AdminManageEvents", 
      component: AdminManageEvents
    },
    { 
      path: "/StudentHome", 
      alias: "/StudentHome",
      name: "StudentHome", 
      component: StudentHome,
    },
    {
      path: "/",
      alias: "/Login",
      name: "Login",
      component: Login,
    },
  //   {
  //     path: "/Create",
  //     alias: "/CreateResume",
  //     name: "CreateResume",
  //     component: CreateResume,
  //   },

  //   {
  //     path: '/admin-view', 
  //     name: 'AdminView', 
  //     component: AdminView,
  //     props: route => ({ resumeId: route.query.resumeId })
  //   }
  ],
});
export default router;
