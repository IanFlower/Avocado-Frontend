import { createRouter, createWebHistory } from "vue-router";
import { authorizeRoute, authorizeUser, ENUM } from "./auth/routeAuth";
import Login from "./views/Login.vue";
import StudentHome from "./views/StudentHome.vue";
import Badges from "./views/Badges.vue";
import Shop from "./views/Shop.vue";
import Calendar from "./views/Calendar.vue";
import leaderBoard from "./views/leaderBoard.vue";
import Unauthorized from "./views/Unauthorized.vue";
import AdminHome from "./views/AdminHome.vue";
import AdminManageEvents from "./views/AdminManageEvents.vue";
import ManageExperiencesTasks from "./views/ManageExperiencesTasks.vue";
import UserInfoDialog from "./components/UserInfoDialog.vue";
import AdminShop from "./views/AdminShop.vue";
import AddReward from "./components/AddReward.vue";
import AdminViewRewards from "./views/AdminViewRewards.vue";
import PurchaseRewards from "./views/PurchaseRewards.vue";
import AdminBadge from "./views/AdminBadge.vue";
import ManageUsers from "./views/ManageUsers.vue"
import approval from "./views/approval.vue";
import AdminBadge from "./views/AdminBadge.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/AdminHome",
      alias: "/AdminHome",
      name: "AdminHome",
      component: AdminHome,
    },
    {
      path: "/AdminManageEvents",
      alias: "/AdminManageEvents",
      name: "AdminManageEvents",
      component: AdminManageEvents,
    },
    {
      path: "/home",
      alias: "/studentHome",
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
      path: "/UserInfoDialog", 
      alias: "/UserInfoDialog",
      name: "UserInfoDialog", 
      component: UserInfoDialog,
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
      beforeEnter: async (to, from, next) => {
        if (true !== (await authorizeRoute(ENUM.ADD_EXPERIENCE))) next({
          name: 'unauthorized',
        });
        next();
      },
    },
    {
      path: "/approval",
      alias: "/approval",
      name: "approval",
      component: approval,
    },
    {
      path: "/badges",
      alias: "/BadgePage",
      name: "badge",
      component: Badges,
    },
    {
      path: "/shop",
      alias: "/shopPoints",
      name: "shop",
      component: Shop,
    },
    {
      path: "/calendar",
      alias: "/calendarPage",
      name: "calendar",
      component: Calendar,
    },
    {
      path: "/leaderboard",
      alias: "/leaderboardPage",
      name: "leaderboard",
      component: leaderBoard,
    },
    {
      path: "/unauthorized",
      alias: "/unauthorizedPage",
      name: "unauthorized",
      component: Unauthorized,
    },
    {
      path: '/Purchase/:userId',
      alias: '/PurchaseRewards', // Both paths now match and use :userId
      name: 'purchaseRewards',
      component: PurchaseRewards,
      props: true, // Pass the userId as a prop to the component
    },
    {
      path: '/AdminShop',
      alias: '/adminShop',
      name: "AdminShop",
      component: AdminShop,
    },
    {
      path: '/AdminBadge',
      alias: '/adminBadge',
      name: "AdminBadge",
      component: AdminBadge,
    },
    {
      path: '/ViewRewards',
      alias: '/AdminViewRewards',
      name: 'ViewRewards',
      component: AdminViewRewards,
    },
    {
      path: '/AddReward',
      alias: '/AddReward',
      name: 'AddReward',
      component: AddReward,
    }
  ],
});

router.beforeResolve(async (to, from) => {
  if (true !== (await authorizeUser()) && to.name !== 'Login') return { name: 'Login' };
})

export default router;
