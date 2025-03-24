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
                  :class="{ 'secondary': !t.flightPlanTask.completed, 'accent': t.flightPlanTask.completed }"
                  class="w-97 pa-0 mb-5 mr-2" elevation="2" shaped
                  @click="handleTaskClick(t)">
                  <v-card-text class="text-h6 pa-0 pl-4">
                    <v-row class="pa-0 ma-0" height="60">
                      <v-col class="ml-4 mt-1">
                        <v-row>{{ t.task.name }}</v-row>
                        <v-row v-if="t.flightPlanTask.subtext" class=" text-subtitle-2 font-italic font-weight-thin"><v-divider vertical class="mx-3 secondary"></v-divider>{{t.flightPlanTask.subtext}}</v-row>
                      </v-col>
                      <v-col align="center" v-if="t.flightPlanTask.completed" class="font-weight-bold">Completed</v-col>
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
              <div class="d-flex flex-column align-center">
                <span class="font-weight-bold">Points:</span>
                <span class="text-h6">{{ selectedStudentPoints ? selectedStudentPoints : 0 }}</span>
              </div>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Leaderboard Section -->
        <v-row align="center" class="pa-12">
          <v-card class="d-flex flex-column text-center primary w-100" height="300px" @click="goToLeaderboard">
            <v-card-title 
              class="text-h4">Leaderboard</v-card-title>            
            <v-divider></v-divider>
            <v-card-text>
              <v-row
                v-for="(student, index) in students.slice(0, 3)" 
                :key="student.id"
                align="center"
                class="py-1"
              >
                <!-- Medal Image -->
                <v-col cols="3" class="d-flex justify-center align-center">
                  <v-avatar size="40">
                    <v-img :src="getMedal(index)" alt="Medal"></v-img>
                  </v-avatar>
                </v-col>

                <!-- Student Info -->
                <v-col cols="9">
                  <v-card
                    :class="getRankClass(index)"
                    class="text-h6 font-weight-bold py-1 px-2 "
                  >
                    <div class="d-flex justify-space-between align-center name-container">
                      <span class="name-text">{{ student.fname }} {{ student.lname.charAt(0) }}.</span>
                      <span class="text-body-2">{{ student.earnedPoints }} points</span>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
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
import EventServices from "../services/eventServices"

import EventServices from "../services/eventServices";
import FlightPlanTask from "../services/flightPlanTaskServices";
import TaskDialog from "../components/TaskDialog.vue";
import studentInfoServices from "../services/studentInfoServices.js";   
import Utils from "../config/utils.js";
import leaderboardService from '../services/leaderboardServices.js';
import medal1 from '../assets/number_1.svg';
import medal2 from '../assets/number_2.svg';
import medal3 from '../assets/number_3.svg';

const clickedExperience = ref({});
const totalTasks = 10;
const tasksCompleted = ref(0);
const progressValue = ref(0);
const clickedTask = ref(Array(totalTasks).fill(false));
const dropdownOpen = ref(false);
const selectedYear = ref(2025);
const selectedSeason = ref('Spring');
const availableYears = ref([2022, 2023, 2024, 2025, 2026]);
const user = Utils.getStore("user");
let userId = user ? user.id : null;
const router = useRouter();
const upcomingEvents = ref([]);
const selectedStudentPoints = ref(null);

// leaderboard variables
const students = ref([]);

onMounted(() => {
  getUpcomingEvents();
  getLeaderboardinfo();
});

function getLeaderboardinfo(){
  leaderboardService.getSortedStudentsByClass(userId).then((response) => {
    if (response) {
      students.value = response.data;
      if (students.value.length > 0) {
        selectedStudentPoints.value = students.value.find(student => student.userId === userId).currentPoints;
      }
    } else {
      console.log("No students found");
    }
  }).catch(error => {
    console.log("Error fetching leaderboard:", error);
  });
}
=======
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
      let currDate = Date.now();
      let filteredData = res.data.map((event) => {
        if (Date.parse(event.startDateTime) >= currDate - 86400000) {
          return event;
        }
      });
      upcomingEvents.value = filteredData.sort((a, b) => {return Date.parse(a.startDateTime) - Date.parse(b.startDateTime)}).slice(0, 6);
    } else {
      console.log("No events found");
    }
  }).catch(error => {
    console.log("Error fetching events:", error);
  });
}

function parseTime(date) {
  let time = date.match(/T(\d{2}):(\d{2}):\d{2}/);
  let hours = parseInt(time[1], 10);
  let minutes = time[2];
  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}

function parseDate(date) {
  let parsedDate = new Date(date).toDateString();
  if ( date.match(/\d{4}-\d{2}-(\d{2})/) != parsedDate.match(/^(?:\S+\s+){2}(\S+)/)) {
    let weekday = parsedDate.match(/^(\S+)/)
    let month = parsedDate.match(/^(?:\S+\s+)(\S+)/)
    let day = date.match(/\d{4}-\d{2}-(\d{2})/)
    let year = date.match(/(\d{4}-\d{2}-\d{2}).*\d{4}/)
    return `${weekday[0]} ${month[1]} ${day[1]} ${year[0]}`
  } else {
    return parsedDate;
  }
}

function selectSeason(season, year) {
  selectedYear.value = year;
  selectedSeason.value = season;
  dropdownOpen.value = false;
}

function getRankClass(index) {
  if (index === 0) return 'bg-gold';  
  if (index === 1) return 'bg-silver'; 
  if (index === 2) return 'bg-bronze'; 
  return ''; 
}
function getMedal(index) {
  if (index === 0) return medal1;
  if (index === 1) return medal2;
  if (index === 2) return medal3;
  return null;
}

function goToShop() {
  router.push("/shop");
}

function goToBadges() {
  router.push("/badges");
}

function goToCalendar() {
  router.push("/calendar");
}
function goToLeaderboard() {
  router.push("/leaderboard");
}

function handleTaskClick(n) {
  clickedTask.value[n] = !clickedTask.value[n];
  tasksCompleted.value = clickedTask.value.filter(Boolean).length;
  progressValue.value = (tasksCompleted.value / totalTasks) * 100;
}
=======
function getTasks() {
  FlightPlanTask.getFlightPlanTaskByUserId(JSON.parse(localStorage.getItem("user")).id)
  .then((res) => {
    tasks.value = res.data.tasks.sort((taskA, taskB) => {return taskA.task.priority - taskB.task.priority});
  })
}

const clickedExperience = ref({});

const totalTasks = 10;
const tasksCompleted = ref(0);
const progressValue = ref(0);
const clickedTask = ref(Array(totalTasks).fill(false));

const user = Utils.getStore("user");
let userId = user ? user.id : null;


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
.bg-gold {
  background-color: #ffd700; 
}

.bg-silver {
  background-color: #c0c0c0; 
}

.bg-bronze {
  background-color: #cd7f32; 
}

.name-container {
  max-width: 100%; 
  overflow: hidden; 
}

.name-text {
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}
</style>
