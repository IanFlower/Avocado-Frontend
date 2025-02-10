import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import StudentHome from "./views/StudentHome.vue"
// import HomePage from "./views/HomePage.vue";
// import AdminPage from "./components/AdminPage.vue"
// import AdminView from "./components/AdminView.vue";
import ManageUsers from "./views/ManageUsers.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  //   { 
  //     path: "/Admin", 
  //     alias: "/AdminPage",
  //     name: "AdminPage", 
  //     component: AdminPage
  //   },
    { 
      path: "/StudentHome", 
      alias: "/StudentHome",
      name: "StudentHome", 
      component: StudentHome,
    },
    { 
      path: "/ManageUsers", 
      alias: "/ManageUsers",
      name: "ManageUsers", 
      component: ManageUsers,
    },


    {
      path: "/",
      alias: "/Login",
      name: "Login",
      component: Login,
    },


  //   {
  //     path: '/admin-view', 
  //     name: 'AdminView', 
  //     component: AdminView,
  //     props: route => ({ resumeId: route.query.resumeId })
  //   }
  ],
});
export default router;
