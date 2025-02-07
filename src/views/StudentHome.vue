<template>
  <v-container fluid class="pa-0 ma-0 mx-2" style="min-height: 100vh;">
    <v-row class="align-start justify-start" style="height: 100%;">
      <v-col cols="3"></v-col>

      <!-- Semester with Dropdown Menu -->
      <v-col cols="6" class="d-flex justify-center">
        <v-card class="pa-2 d-flex justify-center text-center" elevation="0">
          <v-card-title class="text-h5 font-weight-medium d-flex align-center">
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
          </v-card-title>
        </v-card>
      </v-col>

      <!-- Points -->
      <v-col cols="3" class="d-flex justify-center">
        <v-card class="pa-3 text-center accent clickable-card" width="40%" elevation="12" @click="handlePointClick">
          <v-card-title class="text-subtitle-1">Points:</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upcoming Events -->
    <v-row class="pa-3 ma-0">
      <v-col cols="3" class="d-flex justify-center pa-1">
        <v-card class="d-flex flex-column pa-2 text-center" height="110%" width="60%" style="background-color: #D5DFE7; color: black;">
          <v-card-title class="text-subtitle-1 text-center">Upcoming Events</v-card-title>
          <v-divider></v-divider>
          <v-spacer></v-spacer>
          <v-card-actions class="justify-center secondary">
            <v-btn variant="plain" style="font-size: 10px; color: black;" @click="goToCalendar">
              View Calendar
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Tasks -->
      <v-col cols="6" class="pa-1">
        <!-- Progress Bar Section -->
        <v-row class="mb-2 align-center justify-center">
          <v-col cols="6" class="pa-0 position-relative">
            <!-- Progress Label on the Left -->
            <v-row class="align-center" style="position: absolute; top: -20px; left: 0;">
              <v-col class="pa-0">
                <v-typography class="font-weight-bold" style="font-size: 14px;">
                  Progress:
                </v-typography>
              </v-col>
            </v-row>

            <!--Progress Bar-->
            <v-progress-linear v-model="progressValue" height="20" color="primary" rounded></v-progress-linear>

            <!-- Fraction of Task Completed / Total Tasks-->
            <v-row class="align-center" style="position: absolute; top: -20px; right: 0;">
              <v-col class="pa-0">
                <v-typography class="font-weight-bold" style="font-size: 14px;">
                  {{ tasksCompleted }} / {{ totalTasks }}
                </v-typography>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <h2 class="text-center">Tasks</h2>

        <v-spacer></v-spacer>

        <v-row style="max-height: 350px; overflow-y: auto; margin-top: 0;">
          <v-col cols="12" v-for="n in 10" :key="n" class="d-flex justify-center">
            <v-btn :class="{ 'secondary-button': !clickedTask[n], 'accent': clickedTask[n] }"
              class="pa-1 mb-1 text-left pl-3" width="85%" height="130%" elevation="2" shaped
              @click="handleTaskClick(n)">
              Task Placeholder
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <!-- Experiences -->
        <h2 class="text-center mt-4">Experiences</h2>

        <v-row style="max-height: 300px; overflow-y: auto; margin-top: 0;">
          <v-col cols="12" v-for="n in 10" :key="n" class="d-flex justify-center">
            <v-btn :class="{ 'secondary-button': !clickedExperience[n], 'accent': clickedExperience[n] }"
              class="pa-1 mb-1 text-left pl-3" width="85%" height="130%" elevation="2" shaped
              @click="handleExperienceClick(n)">
              Experience Placeholder
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="3" class="d-flex flex-column align-center pa-2">
        <v-spacer></v-spacer>

        <!-- LeaderBoard -->
        <v-card class="d-flex flex-column pa-4 text-center primary" height="45%" width="70%" elevation="12">
          <v-card-title class="text-subtitle-1">Leaderboard</v-card-title>
          <v-divider></v-divider>

          <v-btn v-for="(n, index) in 4" :key="n" :class="getButtonClass(index)" class="mb-2" @click="goToLeaderboard"
            height="50">
            Leaderboard Placeholder {{ n }}
          </v-btn>
        </v-card>

        <v-spacer></v-spacer>

        <!-- Latest Badge-->
        <h4>Latest Badge: </h4>
        <v-img height="35%" width="35%" :src="elite" alt="Elite" class="clickable-image hover-effect"
          @click="goToBadges"></v-img>
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

const handlePointClick = () => {
  router.push('/shop');
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
