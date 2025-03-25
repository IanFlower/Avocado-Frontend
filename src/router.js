import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
 import StudentHome from "./views/StudentHome.vue";
 import Badges from "./views/Badges.vue";
import Shop from "./views/Shop.vue";
import Calendar from "./views/Calendar.vue";
import leaderBoard from "./views/leaderBoard.vue";
import AdminHome from "./views/AdminHome.vue";
import AdminManageEvents from "./views/AdminManageEvents.vue";
import ManageExperiencesTasks from "./views/ManageExperiencesTasks.vue"
import UserInfoDialog from "./components/UserInfoDialog.vue"
// import HomePage from "./views/HomePage.vue";
// import AdminPage from "./components/AdminPage.vue"
// import AdminView from "./components/AdminView.vue";
import ManageUsers from "./views/ManageUsers.vue"
import approval from "./views/approval.vue"

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
      path: "/home", 
      alias: "/studentHome",
      name: "StudentHome", 
      component: StudentHome
    },
    { 
      path: "/ManageUsers", 
      alias: "/ManageUsers",
      name: "ManageUsers", 
      component: ManageUsers,
    },
    { 
      path: "/UserInfoDialog", 
      alias: "/UserInfoDialog",
      name: "UserInfoDialog", 
      component: UserInfoDialog
    },

    {
      path: "/",
      alias: "/Login",
      name: "Login",
      component: Login,
    },

    {
      path: "/ManageExperiencesTasks",
      alias: "/ManageExperiencesTasks",
      name: "ManageExperiencesTasks",
      component: ManageExperiencesTasks,
    },
    {
      path: "/approval",
      alias: "/approval",
      name: "approval",
      component: approval,
    },

  //   {
  //     path: '/admin-view', 
  //     name: 'AdminView', 
  //     component: AdminView,
  //     props: route => ({ resumeId: route.query.resumeId })
  //   }
  {
    path: '/badges',
    alias: '/BadgePage',
    name: "badge",
    component: Badges,
  },
  {
    path: '/shop',
    alias: '/shopPoints',
    name: "shop",
    component: Shop,
  },
  {
    path: '/calendar',
    alias: '/calendarPage',
    name: "calendar",
    component: Calendar,
  },
  {
    path: '/leaderboard',
    alias: '/leaderboardPage',
    name: "leaderboard",
    component: leaderBoard,
  }
  ],
});
export default router;
