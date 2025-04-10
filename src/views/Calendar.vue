<script setup>
import { useRouter } from 'vue-router';
import { VCalendar } from 'vuetify/labs/VCalendar'

const router = useRouter();

  const goHome = () => {
    router.push('/home'); 
  };

</script>

<template>

<div>
  <v-calendar class="ma-4"></v-calendar>
</div>

<!-- <v-row class="pa-2 ma-0">
    <v-col cols="3" class="d-flex justify-center pa-1">
      <v-card class="d-flex flex-column pa-2 align-center text-center" height="700px" width="60%"
        style="background-color: #D5DFE7; color: black;">
        <v-card-title class="text-subtitle-1 text-center">Upcoming Events</v-card-title>
        <v-divider></v-divider>
        <v-spacer></v-spacer>
        <v-card-actions class="justify-center secondary">
          <v-btn variant="plain" style="font-size: 10px; color: black;" @click="goHome">
            View Calendar
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
</v-row> -->

</template>