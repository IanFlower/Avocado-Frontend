<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ocLogo from "../assets/OC-really-good-logo.png";
import Utils from "../config/utils";
import userService from "../services/userServices";
import authServices from "../services/authServices";
import Notification from "../services/notification.Services";
import roleUserServices from "../services/roleUserServices"; // Importing a service to manage user roles
import roleServices from "../services/roleServices"; // Importing a service to manage roles

const user = ref(null); // Reactive variable to store the logged-in user
const title = ref("Career services"); // Reactive title 
const initials = ref(""); // Reactive variable to store user initials
const name = ref(""); // Reactive variable to store the user's full name
const logoURL = ref(""); // Reactive variable for the logo URL
const router = useRouter(); // Vue Router instance for navigation
const drawer = ref(false); // Set drawer to false to keep it closed by default
const notifications = ref([]) // List of notifications
const role = ref(""); // Reactive variable to store user role

const goToProfile = () => {
    router.push({ name: 'Profile', params: { userId: user.value.id } });
};

// Function to retrieve user data from local storage and fetch additional user info
const resetMenu = () => {
    const storedUser = Utils.getStore("user");
    if (storedUser) {
        user.value = storedUser;
        initials.value = storedUser.fName[0] + storedUser.lName[0]; // Extract initials
        name.value = storedUser.fName + " " + storedUser.lName; // Concatenate full name
    }
    if (user.value) {
        roleUserServices.getRoleByUserId(user.value.id) // Fetch user role
            .then((res) => {
                roleServices.getRoleById(res.data.roleId) // Fetch role details
                    .then((res) => {
                        role.value = res.data.name;
                    });
            })
            .catch((error) => {
                console.error("Error fetching user roles:", error);
            });
    }

};

function logout() {
    authServices.logoutUser(user.value.token)
        .then(user.value = null, router.push({ name: 'Login' }))
}

async function getNotifications() {
    let res = await Notification.getByUser()
    if (res) {
        notifications.value = res.data
    } else {
        notifications.value = null
    }
}

async function deleteNotification(notification) {
    await Notification.deleteNotification(notification.id)
    getNotifications()
}

onMounted(() => {
    logoURL.value = ocLogo;
    resetMenu();
    getNotifications();
});
</script>

<template>
    <div>
        <v-app-bar app class="primary">
            <v-btn @click="drawer = !drawer">
                <v-icon icon="mdi-menu" size="30"></v-icon>
            </v-btn>

            <!-- OC Logo -->
            <div v-if="role == 'student' || role == 'student worker'">

                <router-link :to="{ name: 'StudentHome' }">
                    <v-img style="background-blend-mode: color-burn; outline: none !important;" :src="logoURL"
                        height="50" width="50"></v-img>
                </router-link>
            </div>
            <div v-if="role == 'admin' || role == 'proffessor'">
                <router-link :to="{ name: 'AdminHome' }">
                    <v-img style="background-blend-mode: color-burn; outline: none !important;" :src="logoURL"
                        height="50" width="50"></v-img>
                </router-link>
            </div>

            <v-toolbar-title class="title">Career Services</v-toolbar-title>
            <v-spacer></v-spacer>

            <!-- Notifications -->
            <v-menu bottom max-width="300px" rounded offset-y :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props">
                        <v-icon v-if="notifications.length == 0" icon="mdi-bell" size="30"></v-icon>
                        <v-icon v-if="notifications.length > 0" icon="mdi-bell-ring" size="30"></v-icon>
                    </v-btn>
                </template>

                <v-card class="pa-4">
                    <v-card-title class="mb-3">Notifications</v-card-title>
                    <v-card-text class="text-center" v-if="notifications.length == 0">No notifications</v-card-text>
                    <v-card-text class="text-center">
                        <v-row v-for="n in notifications" :key="n" class="mb-3">
                            <v-card class="w-100" variant="outlined"
                                :color="n.goodNews ? 'green-lighten-2' : 'red-lighten-2'">
                                <v-row class="w-100 mt-1 ml-1 overflow-y-visible">
                                    <v-col class="ma-0 pa-0 pl-2 pt-2 overflow-y-visible text-h6" align="start">{{
                                        n.title }}</v-col>
                                    <v-col class="ma-0 pa-0 mr-1" align="end">
                                        <v-icon max-height="21" max-width="21"
                                            @click="deleteNotification(n)">mdi-close</v-icon>
                                    </v-col>
                                </v-row>
                                <v-card-text class="text-left">{{ n.desc }}</v-card-text>
                            </v-card>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-menu>

            <!-- User Dropdown Menu -->
            <v-menu bottom min-width="200px" rounded offset-y v-if="user">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon x-large>
                        <v-avatar v-if="user" color="white">
                            <v-img :src="user.profilePicture" alt="Profile Picture" v-if="user.profilePicture"></v-img>
                            <v-icon v-else>{{ initials }}</v-icon>
                        </v-avatar>
                    </v-btn>
                </template>

                <v-card class="pa-4">
                    <v-card-text class="text-center">
                        <v-btn @click="goToProfile" class="tertiary-button d-flex align-center justify-center" block
                            height="56">
                            <span class="text-h6">{{ name }}</span>
                        </v-btn>
                        <p class="text-caption mb-1">{{ user.email }}</p>
                        <v-divider></v-divider>
                    </v-card-text>


                    <v-card-actions class="d-flex flex-column align-center pa-0">
                        <p class="ma-0">Dark mode</p>
                        <v-switch :model-value="true" color="black"></v-switch>
                    </v-card-actions>

                    <v-card-text class="text-center pt-0">
                        <v-btn depressed rounded text class="secondary-button" @click="logout">Logout</v-btn>
                    </v-card-text>
                </v-card>
            </v-menu>
        </v-app-bar>

        <!-- Navigation Drawer -->
        <v-navigation-drawer v-model="drawer" class="primary opacity-1">
            <div v-if="role == 'student' || role == 'student worker'">
                <v-list>
                    <v-list-item>
                        <v-list-item-title style="text-align: center;">STUDENT</v-list-item-title>
                        <v-divider></v-divider>
                    </v-list-item>
                    <v-list-item :to="{ name: 'StudentHome' }">
                        <v-btn variant="text">Dashboard</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'Badges' }">
                        <v-btn variant="text">Badges</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'Shop' }">
                        <v-btn variant="text">Rewards</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'LeaderBoard' }">
                        <v-btn variant="text">Leaderboard</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'Calendar' }">
                        <v-btn variant="text">Calender</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'Profile', params: { userId: user.id } }">
                        <v-btn variant="text">Profile</v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn variant="text" to="/RequestExperience">Request Experience</v-btn>
                    </v-list-item>
                </v-list>
            </div>
            <div v-if="role == 'admin' || role == 'proffessor' || role == 'student worker'">
                <v-list-item>
                    <v-list-item-title style="text-align: center;">ADMIN</v-list-item-title>
                    <v-divider></v-divider>
                </v-list-item>
                <v-list>
                    <v-list-item :to="{ name: 'AdminHome' }">
                        <v-btn variant="text">Dashboard</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'Approval' }">
                        <v-btn variant="text">Student Approval</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'ManageUsers' }">
                        <v-btn variant="text">User Management</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'AdminManageEvents' }">
                        <v-btn variant="text">Event Management</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'AdminBadge' }">
                        <v-btn variant="text">Badge Management</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'ManageExperiencesTasks' }">
                        <v-btn variant="text">Tasks/Experiences</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'ViewRewards' }">
                        <v-btn variant="text">Reward Management</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'AdminShop' }">
                        <v-btn variant="text">Purchase Rewards</v-btn>
                    </v-list-item>
                    <v-list-item :to="{ name: 'Logs' }">
                        <v-btn variant="text">Logs</v-btn> 
                    </v-list-item>
                </v-list>
            </div>

        </v-navigation-drawer>
    </div>
</template>
