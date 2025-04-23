<template>
  <v-app>
    <!-- <MenuBar v-if="!isLoginPage" :key="$route.fullPath" /> -->
    <ThemeSwitcher v-model="isDark"/>
    <MenuBar v-if="!isLoginPage" :key="$route.fullPath" /> 
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref, provide } from 'vue';
import { useRoute } from 'vue-router';
import '../src/assets/styles.css'
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import MenuBar from "./components/MenuBar.vue";
import Utils from './config/utils';
const route = useRoute();
const isLoginPage = computed(() => route.name === 'Login');
const isDark = ref(false);
try{
  let user = Utils.getStore("user");
  isDark.value = user.darkMode;
}
catch{
  isDark.value = false;
}
provide('isDark', isDark);
</script>
