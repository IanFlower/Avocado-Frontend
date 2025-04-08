import { createRouter, createWebHistory } from "vue-router";
import { authorizeRoute, authorizeUser, ENUM } from "./auth/routeAuth";

// Import views and components
import Login from "./views/Login.vue";
import StudentHome from "./views/StudentHome.vue";
import Badges from "./views/Badges.vue";
import Shop from "./views/Shop.vue";
import Calendar from "./views/Calendar.vue";
import LeaderBoard from "./views/leaderBoard.vue";
import Unauthorized from "./views/Unauthorized.vue";
import AdminHome from "./views/AdminHome.vue";
import AdminManageEvents from "./views/AdminManageEvents.vue";
import ManageExperiencesTasks from "./views/ManageExperiencesTasks.vue";
import UserInfoDialog from "./components/UserInfoDialog.vue";
import Approval from "./views/approval.vue";
import RequestExperience from "./views/RequestExperience.vue";
import AdminShop from "./views/AdminShop.vue";
import AddReward from "./components/AddReward.vue";
import AdminViewRewards from "./components/AdminViewRewards.vue";
import PurchaseRewards from "./components/PurchaseRewards.vue";
import ManageUsers from "./views/ManageUsers.vue";
import approval from "./views/approval.vue";
import AdminBadges from "./views/AdminBadges.vue";
import profilePage from "./views/ProfilePage.vue";

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
        if (true !== (await authorizeRoute(ENUM.ADD_EXPERIENCE))) {
          next({ name: "unauthorized" });
        } else {
          next();
        }
      },
    },
    {
      path: "/approval",
      alias: "/approval",
      name: "Approval",
      component: Approval,
    },
    {
      path: "/badges",
      alias: "/BadgePage",
      name: "Badges",
      component: Badges,
    },
    {
      path: "/shop",
      alias: "/shopPoints",
      name: "Shop",
      component: Shop,
    },
    {
      path: "/calendar",
      alias: "/calendarPage",
      name: "Calendar",
      component: Calendar,
    },
    {
      path: "/leaderboard",
      alias: "/leaderboardPage",
      name: "LeaderBoard",
      component: LeaderBoard,
    },
    {
      path: "/unauthorized",
      alias: "/unauthorizedPage",
      name: "Unauthorized",
      component: Unauthorized,
    },
    {
      path: "/RequestExperience",
      alias: "/RequestExperience",
      name: "RequestExperience",
      component: RequestExperience,
    },
    {
      path: "/Purchase/:userId",
      alias: "/PurchaseRewards/:userId",  // You can keep this alias if needed for URL compatibility
      name: "PurchaseRewards",
      component: PurchaseRewards,
      props: true, // Pass the userId as a prop to the component
    },
    {
      path: "/AdminShop",
      alias: "/adminShop",
      name: "AdminShop",
      component: AdminShop,
    },
    {
      path: '/AdminBadge',
      alias: '/adminBadge',
      name: "AdminBadge",
      component: AdminBadges,
    },
    {
      path: "/ViewRewards",
      alias: "/AdminViewRewards",
      name: "ViewRewards",
      component: AdminViewRewards,
    },
    {
      path: "/AddReward",
      alias: "/AddReward",
      name: "AddReward",
      component: AddReward,
    },
    {
      path: "/ProfilePage",
      alias: "/profilePage",
      name: "ProfilePage",
      component: profilePage,
    }
  ],
});

// Global navigation guard to check user authorization
router.beforeResolve(async (to, from) => {
  if (true !== (await authorizeUser()) && to.name !== "Login") {
    return { name: "Login" };
  }
});

export default router;
