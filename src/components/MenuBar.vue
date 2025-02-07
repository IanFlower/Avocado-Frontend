<script setup>
import { ref, onMounted } from "vue"; // Importing Vue's reactivity and lifecycle hooks
import { useRouter } from "vue-router"; // Importing Vue Router for navigation
import ocLogo from "../assets/OC-really-good-logo.png"; // Importing the OC logo image
import Utils from "../config/utils"; // Importing a utility module for local storage management
import userService from "../services/userServices"; // Importing a user service to fetch user data
import authServices from "../services/authServices";

const user = ref(null); // Reactive variable to store the logged-in user
const title = ref("Career services"); // Reactive title 
const initials = ref(""); // Reactive variable to store user initials
const name = ref(""); // Reactive variable to store the user's full name
const logoURL = ref(""); // Reactive variable for the logo URL
const router = useRouter(); // Vue Router instance for navigation
const admin = ref(null); // Reactive variable to store admin-related user data
const drawer = ref(null); // Reactive variable to store admin-related user data


// Function to retrieve user data from local storage and fetch additional user info
const resetMenu = () => {
    const storedUser = Utils.getStore("user"); // Retrieve user from local storage
    if (storedUser) {
        user.value = storedUser;
        initials.value = storedUser.fName[0] + storedUser.lName[0]; // Extract initials
        name.value = storedUser.fName + " " + storedUser.lName; // Concatenate full name


    }
};
function logout() {
    authServices.logoutUser(user.value.token)
    .then(user.value = null, router.push({ name: 'Login' }))
}
// Lifecycle hook: Runs when the component is mounted
onMounted(() => {
    logoURL.value = ocLogo; // Set logo URL
    resetMenu(); // Initialize user data
});

</script>

<template>
    <v-app>
        <!-- App Bar -->
        <v-app-bar app class="primary">
            <!-- Hamburger Menu Button -->
            <v-btn @click="drawer = !drawer">
                <v-icon icon="mdi-menu" size="30"></v-icon>
            </v-btn>

            <!-- OC Logo -->
            <router-link :to="{ name: 'StudentHome' }">
                <v-img style="background-blend-mode: color-burn; outline: none !important;" :src="logoURL" height="50"
                    width="50"></v-img>
            </router-link>

            <!-- Title -->
            <v-toolbar-title class="title">Career Services</v-toolbar-title>

            <v-spacer></v-spacer> <!-- Pushes elements to the right -->
            <v-btn>
                <v-icon icon="mdi-bell" size="30"></v-icon>  
            </v-btn>

            <!-- User Dropdown Menu -->
            <v-menu bottom min-width="200px" rounded offset-y v-if="user">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon x-large>
                        <v-avatar v-if="user" color="white">
                            <span class="accent--text font-weight-bold">{{ initials }}</span>
                        </v-avatar>
                    </v-btn>
                </template>

                <!-- User menu content -->
                <v-card class="pa-4">
                    <v-card-text class="text-center">
                        <h3 class="mb-2">{{ name }}</h3>
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

        <!-- Navigation Drawer (Dropdown on the left) -->
        <v-navigation-drawer v-model="drawer" class="primary opacity-1">
            <v-list>
                <v-list-item>
                    <v-list-item-title style="text-align: center;">STUDENT</v-list-item-title>
                    <v-divider></v-divider>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Dash Board</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Profile</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Rewards</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Leaderboard</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Calender</v-btn>
                </v-list-item>
            </v-list>
            <v-list-item>
                <v-list-item-title style="text-align: center;">ADMIN</v-list-item-title>
                <v-divider></v-divider>
            </v-list-item>
            <v-list>
                <v-list-item>
                    <v-btn variant="text">Dash Board</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Manage Users</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Comments</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Student Approval</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Manage Flight Plans</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="text">Badge Management</v-btn>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-app>
</template>
