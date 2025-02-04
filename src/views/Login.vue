<script setup>
import logo from '../assets/OC_and_Career_Service_Logo.png'
</script>

<template>
  <v-container fluid class="pa-0" style="height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center;">
    <v-row no-gutters style="width: 100%; height: 100%;">
      <v-col cols="12" md="4" class="d-flex align-center justify-center">
        <v-sheet outlined height="100%" width="100%" class="d-flex align-center justify-center pa-4">
          <v-img height="250px" width="250px" :src="logo" alt="OC and Career Service Logo"></v-img>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="8">
        <v-sheet 
          outlined 
          height="100%" 
          width="100%" 
          style="text-align: center;" 
          class="d-flex flex-column pa-4 primary"
        >
          <v-card-title style="color: white; font-size: 28px;">
            Welcome To OC's <br>Flight Plan
          </v-card-title>

          <v-spacer></v-spacer> 
          <v-btn class="secondary-button">login</v-btn>
          <v-spacer></v-spacer> 


          <p class="text-center justify-end " style="color: white; font-size: 12px; ">
            "For I know the plans for you..."<br>Jeremiah 29:11
          </p>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
