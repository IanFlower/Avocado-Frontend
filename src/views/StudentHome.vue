<template>
  <v-container fluid class="pa-0 ma-0 mx-2">
    <v-row class="align-center">
      <v-col cols="3"></v-col>
      <v-col cols="6" class="d-flex justify-center">
        <v-card class="pa-2 d-flex align-center justify-center text-center" elevation="0"
          style="background: none; box-shadow: none; width: 100%;">
          <v-card-title class="text-h5 font-weight-medium">
            {{ selectedYear && selectedSeason ? selectedSeason + ' ' + selectedYear : 'Select a Year and Semester' }}
          </v-card-title>
          <v-menu offset-y transition="scale-transition" v-model="dropdownOpen">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="24" style="cursor: pointer;">
                mdi-chevron-down
              </v-icon>
            </template>
            <v-card elevation="6">
              <v-list>
                <v-list-item v-if="!selectedYear" v-for="year in availableYears" :key="year" @click="selectYear(year)">
                  <v-list-item-title class="text-subtitle-1 text-center">
                    {{ year }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="selectedYear && !selectedSeason" @click="selectSeason('Fall')">
                  <v-list-item-title class="text-subtitle-1 text-center">
                    Fall {{ selectedYear }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="selectedYear && !selectedSeason" @click="selectSeason('Spring')">
                  <v-list-item-title class="text-subtitle-1 text-center">
                    Spring {{ selectedYear }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="selectedSeason" v-for="year in availableYears" :key="year" @click="selectYear(year)">
                  <v-list-item-title class="text-subtitle-1 text-center">
                    {{ year }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-card>
      </v-col>
      <v-col cols="3" class="d-flex justify-center">
        <v-card class="pa-3 text-center accent clickable-card" width="180px" elevation="12" @click="handlePointClick">
          <v-card-title class="text-subtitle-1">Points:</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="pa-1 ma-0">
      <v-col cols="3" class="d-flex justify-center pa-1">
        <v-card class="d-flex flex-column pa-2 align-center text-center" height="700px" width="100%"
          style="background-color: #D5DFE7; color: black;">
          <v-card-title class="text-subtitle-1 text-center">Upcoming Events</v-card-title>
          <v-divider></v-divider>
          <v-spacer></v-spacer>
          <v-card-actions class="justify-center secondary">
            <v-btn variant="plain" style="font-size: 10px; color: black;">
              View Calendar
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="6" class="pa-1">
        <h3 class="text-center">Tasks</h3>
        <v-row>
          <v-col cols="12" v-for="n in 5" :key="n" class="d-flex justify-center">
            <v-btn class="pa-1 mb-1 secondary-button text-left pl-3" width="85%" height="40" elevation="2" shaped
              @click="handleTaskClick(n)">
              Task Placeholder
            </v-btn>
          </v-col>
        </v-row>
        <h3 class="text-center mt-4">Experiences</h3>
        <v-row>
          <v-col cols="12" v-for="n in 4" :key="n" class="d-flex justify-center">
            <v-btn class="pa-1 mb-1 secondary-button text-left pl-3" width="85%" height="40" elevation="2" shaped
              @click="handleExperienceClick(n)">
              Experience Placeholder
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="d-flex flex-column align-center pa-2">
        <v-spacer></v-spacer>
        <v-card class="d-flex flex-column pa-4 text-center primary" height="400px" width="70%" elevation="12">
          <v-card-title class="text-subtitle-1">Leaderboard</v-card-title>
          <v-divider></v-divider>
        </v-card>
        <v-spacer></v-spacer>
        <h4>Latest Badge: </h4>
        <v-img height="125px" width="125px" :src="elite" alt="Elite" class="clickable-image" @click="goToBadges"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import elite from '../assets/elite.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedYear = ref(2025) 
const selectedSeason = ref('Spring') 
const availableYears = ref([2022, 2023, 2024, 2025, 2026])
const dropdownOpen = ref(false)

const selectYear = (year) => {
  
  selectedYear.value = year
  selectedSeason.value = null 
}

const selectSeason = (season) => {
  selectedSeason.value = season 
}

const goToBadges = () => {
  router.push('/badges')
}

const handlePointClick = () => {
  router.push({ name: 'shop' })
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
