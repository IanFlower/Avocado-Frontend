<template>
  <v-container fluid class="mt-10">
    <v-row justify="center" align="center">
      <!-- Profile Section -->
      <v-col cols="12" sm="8" class="d-flex justify-center">
        <v-card class="pa-4" width="100%">
          <v-row align="center">
            <v-col cols="12" sm="3" class="d-flex justify-start">
              <v-avatar size="250">
                <v-img :src="user.profilePicture || '/default-profile-pic.jpg'" alt="Profile Picture" />
              </v-avatar>
            </v-col>

            <!-- Name and Email -->
            <v-col cols="12" sm="9" class="d-flex flex-column justify-center">
              <div class="text-h3 font-weight-bold">{{ fullName }}</div>
              <div class="text-subtitle-1 font-italic">{{ user.email }}</div>

              <!-- Major and Department -->
              <div class="text-h6 font-weight-bold mt-2">Classification: {{ classification }}</div>
              <div class="text-h6 font-weight-bold mt-2">Major: {{ majorName }}</div>
              <div class="text-subtitle-2">Department: {{ departmentName }}</div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- Stats Row -->
          <v-row justify="space-between" align="center" no-gutters>
            <!-- Point Stats -->
            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-card class="pa-4 tertiary rounded-xl" max-width="350px" width="100%" style="background-color: #98FB98;">
                <v-card-title class="text-h5 text-center">Point Stats</v-card-title>
                <v-card-text class="text-center">
                  <div class="text-h6">Earned: {{ earnedPoints }}</div>
                  <div class="text-h6">Current: {{ currentPoints }}</div>
                  <div class="text-h6">Spent: {{ pointsSpent }}</div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Leaderboard Stats -->
            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-card class="pa-4 tertiary rounded-xl" max-width="350px" width="100%" style="background-color: #98FB98;">
                <v-card-title class="text-h5 text-center">Leaderboard Stats</v-card-title>
                <v-card-text class="text-center">
                  <p class="text-h6"><strong>#1 Rank Achievements:</strong> {{ timesAtTop }} times</p>
                  <p class="text-h6"><strong>Points at #1:</strong> {{ pointsAtTop }} points</p>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Badges Collected -->
            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-card class="pa-4 tertiary rounded-xl" max-width="350px" width="100%">
                <v-card-title class="text-h5 text-center">Badges Collected</v-card-title>
                <v-card-text class="text-center">
                  <div class="text-h6">Earned This Semester: </div>
                    <div>  <v-img :src="badge.image ? `data:image/*;base64,${badge.image}` : NoImageAvailable"  cover crop height="28vh" width="15vw"></v-img></div>
                  <div class="text-h6">Closest to Completion: </div>
                    <div>  <v-img :src="reward.image ? `data:image/*;base64,${badge.image}` : NoImageAvailable"  cover crop height="28vh" width="15vw"></v-img></div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import userService from '../services/userServices.js';
import studentInfoServices from '../services/studentInfoServices.js';
import leaderboardService from '../services/leaderboardServices.js';
import majorService from '../services/majors.Services.js';
import studentInfoMajorService from '../services/studentInfoMajorServices.js';
import badgeService from '../services/badgeServices.js';
import Utils from '../config/utils.js';

const user = ref({
  fName: '',
  lName: '',
  email: '',
  profilePicture: '',
  majorId: null,
});

const earnedPoints = ref(0);
const currentPoints = ref(0);
const timesAtTop = ref(0);
const pointsAtTop = ref(0);
const majorName = ref('');
const departmentName = ref('');
const userId = Utils.getStore('user') ? Utils.getStore('user').id : null;

const fullName = computed(() => `${user.value.fName} ${user.value.lName}`);
const pointsSpent = computed(() => earnedPoints.value - currentPoints.value);
const classification = ref("");

onMounted(async () => {
  if (userId) {
    try {
      const response = await userService.getUserById(userId);
      if (response.data) {
        user.value = response.data;
      }

      const studentInfo = await studentInfoServices.getStudentInfoById(userId);
      if (studentInfo.data.length > 0) {
        earnedPoints.value = studentInfo.data[0].earnedPoints;
        currentPoints.value = studentInfo.data[0].currentPoints;

        const semestersTillGraduation = studentInfo.data[0].semestersTillGraduation;

        if (semestersTillGraduation <= 2) classification.value = "Senior";
        else if (semestersTillGraduation <= 4) classification.value = "Junior";
        else if (semestersTillGraduation <= 6) classification.value = "Sophomore";
        else classification.value = "Freshman";
      }

      const studentInfoMajor = await studentInfoMajorService.getAllByStudentInfoId(userId);

      if (studentInfoMajor.data.length > 0) {
        for (const major of studentInfoMajor.data) {
          try {
            let m = await majorService.getMajorById(major.majorId);
            if (m.data) {
              majorName.value += `${m.data.name} `;
              departmentName.value += `${m.data.dept} `;
            }
          } catch (err) {
            console.error("Error fetching major details:", err);
          }
        }
      }

      const leaderboardData = await leaderboardService.getSortedStudentsByClass(userId);
      leaderboardData.data.forEach((student, index) => {
        if (student.id === userId && index === 0) {
          timesAtTop.value++;
          pointsAtTop.value = student.earnedPoints;
        }
      });

    } catch (error) {
      console.error('Error fetching user or student info:', error);
    }

    const badgesList = computed(() => badge.value.filter(badge => { if(search.value == '') return true; return badge.name.toLowerCase().includes(search.value.toLowerCase())}));
const badges = ref([]);
    try {
    const response = await badgeService.getAllBadges();
    badges.value = response.data;
    badges.value.forEach(badge => {
      badges.image = null;
      if (badges.image) {
        iconServices.getIconByFile(badges.image).then(icon => {
          if(icon.data){
            badges.image = icon.data;
          }
        });
      }
    });
  } catch (error) {
    console.error('Error fetching badge:', error);
  }
  }
});
</script>
