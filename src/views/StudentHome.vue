<template>
  <v-container fluid class="mt-10 fill-height">
    <v-row>
      <!-- Upcoming Events -->
      <v-col cols="3">
        <v-card class="d-flex flex-column pa-4 text-center secondary w-100" height="665">
          <v-card-title class="text-subtitle-1 text-center">Upcoming Events</v-card-title>
          <v-divider></v-divider>

          <v-card class="secondary mb-5" elevation="0" max-width="400" 
          v-for="e in upcomingEvents" :key="e">
            <v-row align="center" no-gutters>
              <v-col cols="4" class="text-center">
                <div class="text-subtitle-1">{{ parseDate(e.startDateTime) }}</div>
                <div class="text-caption text-grey-darken-1">{{ parseTime(e.startDateTime) }}</div>
              </v-col>
              <v-divider vertical class="mx-2"></v-divider>
              <v-col>
                <div class="text-h6 font-weight-bold">{{ e.name }}</div>
                <div class="text-body-2 text-grey-darken-1">{{ e.location }}</div>
              </v-col>
            </v-row>
          </v-card>
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

        <!-- Tasks Section-->
        <h2 class="text-center my-3">Tasks</h2>
        <v-row no-gutters>
            <v-list class="overflow-y-auto w-100" max-height="250">
                <v-card v-for="t in tasks" :key="t"
                  class="w-97 pa-0 mb-5 mr-2 secondary" elevation="2" shaped
                  @click="handleTaskClick(t)">
                  <v-card-text class="text-h6 pa-0 pl-4">
                    <v-row class="pa-0 ma-0" height="60">
                      <v-col class="ml-4 mt-1">
                        <v-row>{{ t.task.name }}</v-row>
                        <v-row v-if="t.task.subtext" class=" text-subtitle-2 font-italic font-weight-thin"><v-divider vertical class="mx-3 secondary"></v-divider>{{t.task.subtext}}</v-row>
                      </v-col>
                      <v-col align="end" class="text-end">{{ t.task.points }}</v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-list>
        </v-row>

        <!-- Experiences Section -->
        <h2 class="text-center my-3">Experiences</h2>
        <v-row no-gutters>
          <v-list class="overflow-y-auto w-100" max-height="250">
                <v-card v-for="n in 20" :key="n" :class="{ 'secondary-button': !clickedTask[n], 'accent': clickedTask[n] }"
                  class="w-97 pa-0 mb-5 mr-2" elevation="2" shaped height="45px"
                  @click="handleTaskClick(n)">
                  <v-card-text class="text-h6 pa-0 pl-4 pt-2">Experience Placeholder</v-card-text>
                </v-card>
            </v-list>
        </v-row>
      </v-col>



      <v-col cols="3" align="center" class="pa-0">
        <v-row>
          <v-col align="center">
            <v-btn class="text-center accent clickable-card py-8 px-13 d-flex align-center justify-center"
              @click="goToShop" elevation="6" size="x-large">
              Points
            </v-btn>
          </v-col>
        </v-row>

        <!-- Leaderboard -->
        <v-row align="center">
            <v-card class="d-flex flex-column text-center pa-4 primary w-100 ma-4" height="400px">
              <v-card-title class="text-title-1">Leaderboard</v-card-title>
              <v-divider></v-divider>
              <v-btn v-for="(n, index) in 4" :key="n" :class="getButtonClass(index)" class="mb-2"
                @click="goToLeaderboard" style="flex-grow: 1;">
                Leaderboard Placeholder
              </v-btn>
            </v-card>
        </v-row>

        <!-- Latest Badge (Bottom) -->
        <v-row>
          <v-col align="center">
            <h4>Latest Badge:</h4>
            <v-img height="110px" width="110px" :src="elite" alt="Elite" class="clickable-image hover-effect"
              @click="goToBadges"></v-img>
          </v-col>
        </v-row>
      </v-col>





    </v-row>
    <TaskDialog 
      :dialog="showTask"
      :item="currentTask"
      :refresh="refresh"
      @update:dialog="showTask = $event"
      @update:task="changeTask($event)"/>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import elite from '../assets/elite.png';
import EventServices from "../services/eventServices";
import FlightPlanExperiences from "../services/flightPlanTaskServices";
import TaskDialog from "../components/TaskDialog.vue";

const router = useRouter();
const upcomingEvents = ref([]);
const tasks = ref([]);
const showTask = ref(false)
const currentTask = ref(null)
const refresh = ref(null)

onMounted(() => {
  getUpcomingEvents()
  getTasks()
})


function changeTask(task) {
  currentTask.value = task;
  refresh.value = true;
  showTask.value = true;
}

function getUpcomingEvents() {
  EventServices.getAllEvents()
  .then((res) => {
    if (res) {
      let currDate = Date.now()
      let filteredData = res.data.map((event) => {
        if (Date.parse(event.startDateTime) >= currDate - 86400000) {
          return event
        }
      })
      upcomingEvents.value = filteredData.sort((a, b) => {return Date.parse(a.startDateTime) - Date.parse(b.startDateTime)}).slice(0, 6)

    } else {
      console.log("No events found")
    }
  })
}

function parseTime(date) {
  let time = date.match(/T(\d{2}):(\d{2}):\d{2}/);

    let hours = parseInt(time[1], 10);
    let minutes = time[2];
    let period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
}


function parseDate(date) {
  let parsedDate = new Date(date).toDateString();
  if ( date.match(/\d{4}-\d{2}-(\d{2})/) != parsedDate.match(/^(?:\S+\s+){2}(\S+)/)) {
    let weekday = parsedDate.match(/^(\S+)/)
    let month = parsedDate.match(/^(?:\S+\s+)(\S+)/)
    let day = date.match(/\d{4}-\d{2}-(\d{2})/)
    let year = parsedDate.match(/^(?:\S+\s+){3}(\S+)/)
    parsedDate = `${weekday[0]} ${month[1]} ${day[1]} ${year[1]}`
  }
  return parsedDate;
}

function getTasks() {
  FlightPlanExperiences.getFlightPlanTaskByUserId(JSON.parse(localStorage.getItem("user")).id)
  .then((res) => {
    tasks.value = res.data.tasks.sort((taskA, taskB) => {return taskA.task.priority - taskB.task.priority});
  })
}

const clickedExperience = ref({});

const totalTasks = 10;
const tasksCompleted = ref(0);
const progressValue = ref(0);
const clickedTask = ref(Array(totalTasks).fill(false));

const handleTaskClick = (task) => {
  showTask.value = true;
  currentTask.value = task
};

const goToShop = () => {
  router.push('/shop');
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