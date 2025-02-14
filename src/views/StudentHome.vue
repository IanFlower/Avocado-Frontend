<template>
  <v-container class="mt-10">
    <v-row>
      <!-- Upcoming Events -->
      <v-col cols="12" sm="6" md="4" lg="3" xl="3" class="d-flex justify-start">
        <v-card class="d-flex flex-column pa-4 text-center secondary" height="1000" width="100%">
          <v-card-title class="text-subtitle-1 text-center">Upcoming Events</v-card-title>
          <v-divider></v-divider>
          <v-spacer></v-spacer>
          <v-card-actions class="justify-center secondary">
            <v-btn variant="plain" class="font-weight-light text-subtitle-1" @click="goToCalendar">
              View Calendar
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>


      <!-- Main Section -->
      <v-col cols="6">
        <!-- Semester Selection -->
        <v-row class="d-flex justify-center">
          <v-card class="d-flex justify-center text-center h-auto py-4 w-90" elevation="0">
            <h1 class="text-h3 font-weight-medium d-flex align-center">
              {{ selectedYear && selectedSeason ? selectedSeason + ' ' + selectedYear : 'Select a Year and Semester' }}
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
            </h1>
          </v-card>
        </v-row>

        <v-row>
          <v-col cols="6" class="my-4"></v-col>
        </v-row>

        <!-- Tasks Section-->
        <h2 class="text-center my-3">Tasks</h2>
        <v-row class="d-flex flex-column align-center" no-gutters>
          <v-col cols="12" class="d-flex justify-center my-2">
            <v-row class="overflow-y-auto" style="max-height: 350px;">
              <v-col v-for="n in 20" :key="n" cols="12" class="d-flex justify-center my-2">
                <v-btn :class="{ 'secondary-button': !clickedTask[n], 'accent': clickedTask[n] }" size="large"
                  class="w-100 py-4 text-h6 d-flex justify-start align-center" elevation="2" shaped
                  @click="handleTaskClick(n)">
                  Task Placeholder
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="my-4"></v-col>
        </v-row>

        <!-- Experiences Section -->
        <h2 class="text-center mt-4 mb-3">Experiences</h2>
        <v-row class="d-flex flex-column align-center" no-gutters>
          <v-col cols="12" class="d-flex justify-center my-2">
            <v-row class="overflow-y-auto" style="max-height: 350px;">
              <v-col v-for="n in 20" :key="n" cols="12" class="d-flex justify-center my-2">
                <v-btn :class="{ 'secondary-button': !clickedExperience[n], 'accent': clickedExperience[n] }"
                  size="large" class="w-100 py-4 text-h6 d-flex justify-start align-center" elevation="2" shaped
                  @click="handleExperienceClick(n)">
                  Experience Placeholder
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>



      <v-col cols="3" class="d-flex flex-column align-center pl-16 ml-0">
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <v-btn class="text-center accent clickable-card py-8 px-16 d-flex align-center justify-center"
              @click="handlePointClick" elevation="6" size="x-large">
              Points
            </v-btn>
          </v-col>
        </v-row>

        <!-- LeaderBoard -->
        <v-row align="center" justify="end" class="flex-grow-1">
          <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="d-flex justify-center">
            <v-card class="d-flex flex-column text-center pa-4 primary w-100 ma-4" height="400px">
              <v-card-title class="text-title-1">Leaderboard</v-card-title>
              <v-divider></v-divider>
              <v-btn v-for="(n, index) in 4" :key="n" :class="getButtonClass(index)" class="mb-2"
                @click="goToLeaderboard" style="flex-grow: 1;">
                Leaderboard Placeholder
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <!-- Latest Badge (Bottom) -->
        <v-row align="end" justify="center" class="flex-grow-0">
          <v-col>
            <h4>Latest Badge:</h4>
            <v-img height="110px" width="110px" :src="elite" alt="Elite" class="clickable-image hover-effect"
              @click="goToBadges"></v-img>
          </v-col>
        </v-row>
      </v-col>





    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import elite from '../assets/elite.png';

const router = useRouter();
const clickedExperience = ref({});

const totalTasks = 10;
const tasksCompleted = ref(0);
const progressValue = ref(0);
const clickedTask = ref(Array(totalTasks).fill(false));

const handleTaskClick = (taskIndex) => {
  clickedTask.value[taskIndex] = !clickedTask.value[taskIndex];
  tasksCompleted.value = clickedTask.value.filter(v => v).length;
  progressValue.value = (tasksCompleted.value / totalTasks) * 100;
};

const goToBadges = () => {
  router.push('/badges');
};

const goToCalendar = () => {
  router.push('/calendar');
};

const goToLeaderboard = () => {
  router.push('/leaderboard');
};

const getButtonClass = (index) => {
  if (index === 0) {
    return 'accent';
  } else if (index === 1) {
    return 'accent opacity-50';
  } else if (index === 2) {
    return 'accent opacity-25';
  } else if (index === 3) {
    return 'white';
  } else {
    return '';
  }
};

const handleExperienceClick = (experienceId) => {
  clickedExperience.value[experienceId] = !clickedExperience.value[experienceId];
};

const dropdownOpen = ref(false);
const selectedYear = ref(2025);
const selectedSeason = ref('Spring');
const availableYears = ref([2022, 2023, 2024, 2025, 2026]);

const selectSeason = (season, year) => {
  selectedSeason.value = season;
  selectedYear.value = year;
  dropdownOpen.value = true;
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

.white {
  background-color: white !important;
  color: black;
}

.opacity-25 {
  opacity: 0.25;
}

.opacity-50 {
  opacity: 0.5;
}

body,
html {
  margin: 0 !important;
  padding: 0 !important;
  height: 100% !important;
}

.v-application {
  margin: 0 !important;
  padding: 0 !important;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>