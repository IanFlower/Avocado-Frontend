<template>
  <v-app>
    <!-- <MenuBar v-if="!isLoginPage" :key="$route.fullPath" /> -->
    <ThemeSwitcher />
    <MenuBar v-if="!isLoginPage" :key="$route.fullPath" /> 
    <v-spacer></v-spacer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import '../src/assets/styles.css'
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import MenuBar from "./components/MenuBar.vue";
const route = useRoute();
const isLoginPage = computed(() => route.name === 'login'); 
</script>
