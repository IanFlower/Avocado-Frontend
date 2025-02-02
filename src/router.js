import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
// import HomePage from "./views/HomePage.vue";
// import CreateResume from "./views/CreateResume.vue";
// import AdminPage from "./components/AdminPage.vue"
// import AdminView from "./components/AdminView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  //   { 
  //     path: "/Admin", 
  //     alias: "/AdminPage",
  //     name: "AdminPage", 
  //     component: AdminPage
  //   },
  //   { 
  //     path: "/home", 
  //     alias: "/homePage",
  //     name: "HomePage", 
  //     component: HomePage
  //   },
    {
      path: "/",
      alias: "/login",
      name: "login",
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
