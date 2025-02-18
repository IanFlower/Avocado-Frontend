<template>
    <v-container class="fill-height d-flex justify-center align-center">
      <v-card class="pa-5 text-center" height="300px" width="300px">
        <v-card-title>Latest Badge</v-card-title>
        <v-img
          height="250px"
          width="250px"
          :src="elite"
          alt="Elite Badge"
          class="clickable-image"
          @click="goHome"
        ></v-img>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import elite from '../assets/elite.png'; 
  
  const router = useRouter();
  
  const goHome = () => {
    router.push('/home'); 
  };
  </script>
  
  <style scoped>
  .clickable-image {
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
  }
  
  .clickable-image:hover {
    transform: scale(1.05);
  }
  </style>
  