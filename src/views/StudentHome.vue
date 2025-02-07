<template>
  <v-container fluid class="pa-0 ma-0 mx-2">
    <v-row class="align-center">
      <v-col cols="3"></v-col>

      <!-- Semester with Dropdown Menu -->

      <v-col cols="6" class="d-flex justify-center">
        <v-card class="pa-2 d-flex justify-center text-center" elevation="0">
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
                <v-list-item v-for="year in availableYears" :key="year">
                  <v-btn block variant="text" class="text-subtitle-1" @click="selectSeason('Fall', year)">
                    Fall {{ year }}
                  </v-btn>
                  <v-btn block variant="text" class="text-subtitle-1" @click="selectSeason('Spring', year)">
                    Spring {{ year }}
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-card>
      </v-col>

      <!-- Points -->

      <v-col cols="3" class="d-flex justify-center">
        <v-card class="pa-3 text-center accent clickable-card" width="180px" elevation="12" @click="handlePointClick">
          <v-card-title class="text-subtitle-1">Points:</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upcoming Events -->

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

      <!-- Tasks -->
      
      <v-col cols="6" class="pa-1">
        <h3 class="text-center">Tasks</h3>
        <v-row style="max-height: 300px; overflow-y: auto;">
          <v-col cols="12" v-for="n in 10" :key="n" class="d-flex justify-center">
            <v-btn class="pa-1 mb-1 secondary-button text-left pl-3" width="85%" height="40" elevation="2" shaped
              @click="handleTaskClick(n)">
              Task Placeholder {{ n }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- Experiences -->
        <h3 class="text-center mt-4">Experiences</h3>
        <v-row style="max-height: 300px; overflow-y: auto;">
          <v-col cols="12" v-for="n in 10" :key="n" class="d-flex justify-center">
            <v-btn class="pa-1 mb-1 secondary-button text-left pl-3" width="85%" height="40" elevation="2" shaped
              @click="handleExperienceClick(n)">
              Experience Placeholder {{ n }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="3" class="d-flex flex-column align-center pa-2">

        <v-spacer></v-spacer>

        <!-- LeaderBoard -->
        <v-card class="d-flex flex-column pa-4 text-center primary" height="400px" width="70%" elevation="12">
          <v-card-title class="text-subtitle-1">Leaderboard</v-card-title>
          <v-divider></v-divider>
        </v-card>

        <v-spacer></v-spacer>

        <!-- Latest Badge-->
        <h4>Latest Badge: </h4>
        <v-img height="80px" width="80px" :src="elite" alt="Elite" class="clickable-image hover-effect" @click="goToBadges"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import elite from '../assets/elite.png';

const router = useRouter();

const goToBadges = () => {
  router.push('/badges');
};

const handlePointClick = () => {
  router.push('/shop');
};

const dropdownOpen = ref(false);
const selectedYear = ref(2025);
const selectedSeason = ref('Spring');
const availableYears = ref([2022, 2023, 2024, 2025, 2026]);

const selectSeason = (season, year) => {
  selectedSeason.value = season;
  selectedYear.value = year;
  dropdownOpen.value = false;
};
</script>

<style scoped>
.clickable-image {
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.clickable-image:hover {
  transform: scale(1.1);
}
</style>
