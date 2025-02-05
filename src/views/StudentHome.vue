<template>
  <v-container fluid class="pa-0 ma-0 mx-3">
    <v-row class="pa-2 ma-0">

      <!-- Left Column (Upcoming Events) -->
      <v-col cols="3" class="d-flex justify-center pa-2">
        <v-card class="d-flex flex-column pa-3 align-center text-center" height="800px" width="100%" style="background-color: #D5DFE7; color: black;">
          <v-card-title class="text-center">Upcoming Events</v-card-title>
          <v-divider></v-divider>
          <v-spacer></v-spacer>
          <v-card-actions class="justify-center secondary">
            <v-btn variant="plain" style="font-size: 11px; color: black;">
              View Calendar
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Middle Column (Tasks & Experiences) -->
      <v-col cols="6" class="pa-2">
        <v-row class="justify-center align-center">
          <v-card class="pa-3 d-flex align-center justify-center text-center" elevation="0" width="100%" style="background: none; box-shadow: none;">
            <v-card-title class="text-h4 font-weight-bold">
              Spring {{ selectedYear }}
            </v-card-title>
            <v-menu offset-y transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="32" style="cursor: pointer;">
                  mdi-chevron-down
                </v-icon>
              </template>
              <v-card elevation="8">
                <v-list>
                  <v-list-item v-for="year in availableYears" :key="year" @click="year">
                    <v-list-item-title class="text-h6 text-center">
                      {{ year }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-card>
        </v-row>

        <!-- Tasks -->
        <h2 class="text-center">Tasks</h2>
        <v-row>
          <v-col cols="12" v-for="n in 5" :key="n" class="d-flex justify-center">
            <v-btn class="pa-2 mb-2 secondary-button text-left pl-4" width="90%" height="50" elevation="2" shaped @click="handleTaskClick(n)">
              Task Placeholder
            </v-btn>
          </v-col>
        </v-row>

        <!-- Experiences -->
        <h2 class="text-center mt-5">Experiences</h2>
        <v-row>
          <v-col cols="12" v-for="n in 4" :key="n" class="d-flex justify-center">
            <v-btn class="pa-2 mb-2 secondary-button text-left pl-4" width="90%" height="50" elevation="2" shaped @click="handleExperienceClick(n)">
              Experience Placeholder
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <!-- Right Column (Points, Leaderboard, Badges) -->
      <v-col cols="3" class="d-flex flex-column align-center pa-2">
        <v-card class="d-flex flex-column pa-5 text-center my-5 accent clickable-card" width="50%" elevation="16" @click="handlePointClick">
          <v-card-title>Points:</v-card-title>
        </v-card>

        <v-card class="d-flex flex-column pa-5 text-center primary" height="400px" width="75%" color="#811420" elevation="16">
          <v-card-title>Leaderboard</v-card-title>
          <v-divider></v-divider>
        </v-card>

        <v-spacer></v-spacer>

        <v-card class="d-flex flex-column pa-5 text-center my-5 align-center" height="300px" width="300px">
          <v-card-title>Latest Badge</v-card-title>
          <v-img height="250px" width="250px" :src="elite" alt="Elite" class="clickable-image" @click="goToBadges"></v-img>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>





<!--Script Setup for Years of available Years-->
<script setup>
import { ref } from 'vue'
import elite from '../assets/elite.png'
import { useRouter } from 'vue-router'

const router = useRouter()


const goToBadges = () => {
  router.push('/badges') 
}

const handlePointClick = () => 
{
  router.push({ name: 'shop' })
}

const year = ref([])



const handleClick = () => {
  console.log('Badge clicked!')
}
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
