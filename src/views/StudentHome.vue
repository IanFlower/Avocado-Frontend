<template>
 <v-container fluid class="mt-10 fill-height">
    <v-row>
      <!-- Upcoming Events -->
      <v-col cols="3">
        <v-card class="d-flex flex-column pa-4 text-center secondary w-100" height="665">
          <v-card-title class="text-subtitle-1 text-center">Upcoming Events</v-card-title>
          <v-divider></v-divider>

          <v-card class="secondary mb-5" elevation="0" max-width="400" v-for="e in upcomingEvents" :key="e">
            <v-row align="center" no-gutters>
              <v-col cols="4" class="text-center">
                <div v-if="e.startDateTime != null" class="text-subtitle-1">{{ parseDate(e) }}</div>
                <div v-if="e.startDateTime != null" class="text-caption text-grey-darken-1">{{ parseTime(e) }}</div>
              </v-col>
              <v-divider vertical class="mx-2"></v-divider>
              <v-col>
                <v-row align="center" class="align-center">
                  <v-icon class="mr-2 ml-2" :color="relatedEventIds.includes(e.id) ? 'green' : 'black'"
                    :size="relatedEventIds.includes(e.id) ? 10 : 10">
                    mdi-checkbox-blank-circle
                  </v-icon>

                  <div class="text-h6 font-weight-bold">
                    {{ e.name }}
                  </div>
                </v-row>

                <div class="text-body-2 font-italic text-grey-darken-1 mt-1">
                  {{ e.location }}
                </div>
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

        <!-- Progress Bar -->
        <v-row class="mt-4 d-flex justify-center">
          <v-col cols="11">
            <div class="d-flex justify-end mb-1">
              <span class="text-subtitle-2 font-weight-medium">
                {{ completedCount === totalCount ? 'Semester Completed' : `${completedCount} / ${totalCount} Completed` }}
              </span>
            </div>
            <v-progress-linear
              :model-value="completionPercentage"
              :buffer-value="100"
              height="24"
              color="#F9C634"
              rounded
              stream
            ></v-progress-linear>
          </v-col>
        </v-row>

        <!-- Tasks Header with Dropdown -->
        <v-row class="d-flex justify-center">
          <v-card class="d-flex justify-center text-center h-auto py-2 w-90" elevation="0">
            <h2 class="text-h5 font-weight-bold d-flex align-center">
              Tasks
              <v-menu offset-y transition="scale-transition" v-model="taskDropdown">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="20" style="cursor: pointer;">
                    mdi-chevron-down
                  </v-icon>
                </template>
                <v-card elevation="6">
                  <v-list>
                    <v-list-item>
                      <v-btn block variant="text" class="text-subtitle-1" @click="selectTaskPriority(null)">
                        Show All
                      </v-btn>
                    </v-list-item>
                    <v-list-item v-for="level in [1,2,3]" :key="level">
                      <v-btn block variant="text" class="text-subtitle-1" @click="selectTaskPriority(level)">
                        Priority {{ level }}
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </h2>
          </v-card>
        </v-row>

        <!-- Task Priority Dropdown -->
        <v-row v-if="showTaskFilter" class="px-4">
          <v-select
            v-model="priorityFilter"
            :items="[1, 2, 3, 4]"
            label="Filter by: Priority"
            variant="outlined"
            hide-details
            dense
          ></v-select>
        </v-row>

        <!-- Filtered Tasks -->
        <v-row no-gutters>
          <v-list class="overflow-y-auto w-100" max-height="250">
            <v-card
              v-for="t in filteredTasks"
              :key="t"
              :class="{ 'secondary': !t.flightPlanTask.completed, 'accent': t.flightPlanTask.completed }"
              class="w-97 pa-0 mb-5 mr-2"
              elevation="2"
              shaped
              @click="handleTaskClick(t)"
            >
              <v-card-text class="text-h6 pa-0 pl-4">
                <v-row class="pa-0 ma-0" height="60">
                  <v-col class="ml-4 mt-1">
                    <v-row>{{ t.task.name }}</v-row>
                    <v-row v-if="t.flightPlanTask.subtext" class="text-subtitle-2 font-italic font-weight-thin">
                      <v-divider vertical class="mx-3 secondary" />
                      {{ t.flightPlanTask.subtext }}
                    </v-row>
                  </v-col>
                  <v-col align="center" v-if="t.flightPlanTask.completed" class="font-weight-bold">
                    Completed
                  </v-col>
                  <v-col align="end" class="text-end">{{ t.task.points }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-list>
        </v-row>

              <!-- Experiences Header with Dropdown -->
              <v-row class="d-flex justify-center">
          <v-card class="d-flex justify-center text-center h-auto py-2 w-90" elevation="0">
            <h2 class="text-h5 font-weight-bold d-flex align-center">
              Experiences
              <v-menu offset-y transition="scale-transition" v-model="experienceDropdown">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="20" style="cursor: pointer;">
                    mdi-chevron-down
                  </v-icon>
                </template>
                <v-card elevation="6">
                  <v-list>
                    <v-list-item>
                      <v-btn block variant="text" class="text-subtitle-1" @click="selectExperiencePriority(null)">
                        Show All
                      </v-btn>
                    </v-list-item>
                    <v-list-item v-for="level in [1,2,3]" :key="level">
                      <v-btn block variant="text" class="text-subtitle-1" @click="selectExperiencePriority(level)">
                        Priority {{ level }}
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </h2>
          </v-card>
        </v-row>

        <!-- Experience Priority Dropdown -->
        <v-row v-if="showExperienceFilter" class="px-4">
          <v-select
            v-model="experiencePriorityFilter"
            :items="[1, 2, 3]"
            label="Filter by: Priority"
            variant="outlined"
            hide-details
            dense
          ></v-select>
        </v-row>

        <!-- Filtered Experiences -->
        <v-row no-gutters>
          <v-list class="overflow-y-auto w-100" max-height="250">
            <v-card
              v-for="ex in filteredExperiences"
              :key="ex"
              :class="{ 'secondary': !ex.flightPlanExperience.completed, 'accent': ex.flightPlanExperience.completed }"
              class="w-97 pa-0 mb-5 mr-2"
              elevation="2"
              shaped
              @click="handleExperienceClick(ex)"
            >
              <v-card-text class="text-h6 pa-0 pl-4">
                <v-row class="pa-0 ma-0" height="60">
                  <v-col class="ml-4 mt-1">
                    <v-row>{{ ex.Experience.name }}</v-row>
                    <v-row v-if="ex.flightPlanExperience.subtext" class="text-subtitle-2 font-italic font-weight-thin">
                      <v-divider vertical class="mx-3 secondary" />
                      {{ ex.flightPlanExperience.subtext }}
                    </v-row>
                  </v-col>
                  <v-col align="center" v-if="ex.flightPlanExperience.completed" class="font-weight-bold">
                    Completed
                  </v-col>
                  <v-col align="end" class="text-end">{{ ex.Experience.points }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-list>
        </v-row>
      </v-col>


      <!-- Points and Student Shop Action -->
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
            <v-card-title class="text-h4">Leaderboard</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row v-for="(student, index) in students.slice(0, 3)" :key="student.id" align="center" class="py-1">
                <v-col cols="3" class="d-flex justify-center align-center">
                  <v-avatar size="40">
                    <v-img :src="getMedal(index)" alt="Medal"></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="9">
                  <v-card :class="getRankClass(index)" class="text-h6 font-weight-bold py-1 px-2">
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

        <!-- Latest Badge -->
        <v-row>
          <v-col align="center">
            <h4>Latest Badge:</h4>
            <v-img height="110px" width="110px" :src="elite" alt="Elite" class="clickable-image hover-effect"
              @click="goToBadges"></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <TaskDialog :dialog="showTask" :item="currentTask" :refresh="refresh" @update:dialog="showTask = $event"
      @update:task="changeTask($event)" @update:refresh="refreshAll()" />
    <ExperienceDialog :dialog="showExperience" :item="currentExperience" :refresh="refresh"
      @update:dialog="showExperience = $event" @update:experience="changeExperience()" @update:refresh="refreshAll()" />
  </v-container>
</template>



<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import elite from '../assets/elite.png';
import EventServices from "../services/eventServices";
import FlightPlanTask from "../services/flightPlanTaskServices";
import TaskDialog from "../components/TaskDialog.vue";
import FlightPlanExperience from "../services/flightPlanExperienceServices";
import ExperienceDialog from "../components/ExperienceDialog.vue";
import Utils from "../config/utils.js";
import FlightPlan from "../services/flightPlanServices"
import leaderboardService from '../services/leaderboardServices.js';
import medal1 from '../assets/number_1.svg';
import medal2 from '../assets/number_2.svg';
import medal3 from '../assets/number_3.svg';

// leaderboard variables
const students = ref([]);

//other variables
const router = useRouter();
const upcomingEvents = ref([]);
const showTask = ref(false)
const currentTask = ref(null)
const showExperience = ref(false)
const currentExperience = ref(null)
const refresh = ref(null)
const selectedStudentPoints = ref(0);

//related event variables
const relatedEventIds = ref([]);

//priority for tasks and experiences
const priorityFilter = ref(null);
const experiencePriorityFilter = ref(null);
const taskDropdown = ref(false);
const experienceDropdown = ref(false);

//tasks and experiences variables
const tasks = ref([]);
const experiences = ref([]);

//user variables
const user = Utils.getStore("user");
let userId = user ? user.id : null;



const filteredTasks = computed(() => {
  if (!priorityFilter.value) return tasks.value;
  return tasks.value.filter(t => (t.task.priority || 0) === priorityFilter.value);
});

const filteredExperiences = computed(() => {
  if (!experiencePriorityFilter.value) return experiences.value;
  return experiences.value.filter(ex => (ex.Experience.priority || 0) === experiencePriorityFilter.value);
});

const selectTaskPriority = (level) => {
  priorityFilter.value = level;
  taskDropdown.value = false;
};

const selectExperiencePriority = (level) => {
  experiencePriorityFilter.value = level;
  experienceDropdown.value = false;
};

onMounted(async () => {
  await FlightPlan.createFlightPlan()
  getUpcomingEvents()
  getTasks()
  getExperiences()
  getLeaderboardinfo();
  getRelatedExperienceEvents();
})

async function getRelatedExperienceEvents() {
  try {
    const res = await FlightPlanExperience.getFlightPlanExperienceByUserId(userId);
    const allExperiences = res.data.Experiences || [];
    const relatedIds = [];

    for (const ex of allExperiences) {
      const result = await FlightPlanExperience.getEventsByExperience(ex.Experience.id);
      result.data.forEach(evt => relatedIds.push(evt.id));
    }

    relatedEventIds.value = relatedIds;
  } catch (err) {
    console.error("Error fetching related experience events:", err);
  }
}

const completedCount = computed(() => {
  const taskCompleted = tasks.value.filter(t => t.flightPlanTask.completed).length;
  const experienceCompleted = experiences.value.filter(ex => ex.flightPlanExperience.completed).length;
  return taskCompleted + experienceCompleted;
});

const totalCount = computed(() => tasks.value.length + experiences.value.length);

const completionPercentage = computed(() => {
  if (totalCount.value === 0) return 0;
  return parseFloat(((completedCount.value / totalCount.value) * 100).toFixed(2));
});

function getLeaderboardinfo() {
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

function refreshAll() {
  getTasks();
  getExperiences();
}

function changeTask(task) {
  currentTask.value = task;
  refresh.value = true;
  showTask.value = true;
  const index = tasks.value.findIndex(t => t.task.id === updatedTask.task.id);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
    tasks.value = [...tasks.value]; 
  }
  currentTask.value = updatedTask;
  showTask.value = true;


}


function changeExperience() {
  getExperiences()
  const index = experiences.value.findIndex(
    (ex) => ex.Experience.id === updatedExperience.Experience.id
  );
  if (index !== -1) {
    experiences.value[index] = updatedExperience;
    experiences.value = [...experiences.value];
  }
  currentExperience.value = updatedExperience;
  showExperience.value = true;

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
        let sortedData = filteredData.sort((a, b) => { return Date.parse(a.startDateTime) - Date.parse(b.startDateTime) }).slice(0, 6)
        upcomingEvents.value = sortedData.filter((item) => { return item !== undefined });
      } else {
        console.log("No events found")
      }
    })
}

function parseTime(date) {
  let time = date.startDateTime.match(/T(\d{2}):(\d{2}):\d{2}/);

  let hours = parseInt(time[1], 10);
  let minutes = time[2];
  let period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}


function parseDate(date) {
  let parsedDate = new Date(date.startDateTime).toDateString();
  if (date.startDateTime.match(/\d{4}-\d{2}-(\d{2})/) != parsedDate.match(/^(?:\S+\s+){2}(\S+)/)) {
    let weekday = parsedDate.match(/^(\S+)/)
    let month = parsedDate.match(/^(?:\S+\s+)(\S+)/)
    let day = date.startDateTime.match(/\d{4}-\d{2}-(\d{2})/)
    let year = parsedDate.match(/^(?:\S+\s+){3}(\S+)/)
    parsedDate = `${weekday[0]} ${month[1]} ${day[1]} ${year[1]}`;

  }
  return parsedDate;
}

function getTasks() {
  FlightPlanTask.getFlightPlanTaskByUserId(JSON.parse(localStorage.getItem("user")).id)
    .then((res) => {
      tasks.value = res.data.tasks.sort((a, b) => {
        const aCompleted = a.flightPlanTask.completed ? 1 : 0;
        const bCompleted = b.flightPlanTask.completed ? 1 : 0;

        if (aCompleted !== bCompleted) {
          return aCompleted - bCompleted;
        }

        return (a.task.priority || 0) - (b.task.priority || 0); 
      });
    });
}


function getExperiences() {
  FlightPlanExperience.getFlightPlanExperienceByUserId(JSON.parse(localStorage.getItem("user")).id)
    .then((res) => {
      experiences.value = res.data.Experiences.sort((a, b) => {
        const aCompleted = a.flightPlanExperience.completed ? 1 : 0;
        const bCompleted = b.flightPlanExperience.completed ? 1 : 0;

        if (aCompleted !== bCompleted) {
          return aCompleted - bCompleted; 
        }

        return (a.Experience.priority || 0) - (b.Experience.priority || 0); 
      });
    });
}

const handleTaskClick = (task) => {
  showTask.value = true;
  currentTask.value = task
};


const handleExperienceClick = (experience) => {
  showExperience.value = true;
  currentExperience.value = experience
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

const dropdownOpen = ref(false);
const selectedYear = ref(2025);
const selectedSeason = ref('Spring');
const availableYears = ref([2022, 2023, 2024, 2025, 2026]);

const selectSeason = (season, year) => {
  selectedSeason.value = season;
  selectedYear.value = year;
  dropdownOpen.value = true;
};

onMounted(() => {

});
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

.related-event-highlight {
  background-color: #e9f5ec !important;
  border-left: 4px solid #43a047;
  transition: background-color 0.3s ease;
}
</style>