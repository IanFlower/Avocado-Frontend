<template>
    <v-container fluid class="mt-10">
      <v-row justify="center" align="center">
        <!-- Profile Section -->
        <v-col cols="12" sm="8" class="d-flex justify-center">
          <v-card class="pa-4" width="100%">
            <v-row align="center">
              <v-col cols="12" sm="3" class="d-flex justify-start">
                <v-avatar size="250">
                  <v-img
                    :src="user.profilePicture || '/default-profile-pic.jpg'"
                    alt="Profile Picture"
                  />
                </v-avatar>
              </v-col>
  
              <v-col cols="12" sm="9" class="d-flex flex-column justify-center">
                <div class="text-h3 font-weight-bold">{{ fullName }}</div>
                <div class="text-subtitle-1 font-italic">{{ user.email }}</div>
                <!-- Major and Department -->
                <div class="text-h6 font-weight-bold mt-2">{{ majorName }}</div>
                <div class="text-subtitle-2">{{ departmentName }}</div>
              </v-col>
            </v-row>
  
            <v-divider class="my-4"></v-divider>
  
            <v-row justify="center">
              <v-col cols="4" class="text-center">
                <div class="text-h6">Earned Points:</div>
                <div class="text-h5 font-weight-bold">{{ earnedPoints }}</div>
              </v-col>
  
              <v-col cols="4" class="text-center">
                <div class="text-h6">Current Points:</div>
                <div class="text-h5 font-weight-bold">{{ currentPoints }}</div>
              </v-col>
  
              <v-col cols="4" class="text-center">
                <div class="text-h6">Points Spent:</div>
                <div class="text-h5 font-weight-bold">{{ pointsSpent }}</div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Leaderboard Stats Section -->
      <v-row justify="center" align="center" class="mt-4">
        <v-col cols="12" sm="8" class="d-flex justify-center">
          <v-card class="pa-4" width="100%">
            <v-row justify="center">
              <v-col cols="auto">
                <v-card-title class="text-h5 primary text-center" style="width: 100%;">Leaderboard Stats</v-card-title>
              </v-col>
            </v-row>
            <v-card-text class="text-center">
              <v-row>
                <v-col cols="12">
                  <p class="text-h5"><strong>#1 Rank Achievements:</strong> {{ timesAtTop }} times</p>
                </v-col>
                <v-col cols="12">
                  <p class="text-h5"><strong>Points at #1:</strong> {{ pointsAtTop }} points</p>
                </v-col>
              </v-row>
            </v-card-text>
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
  
  // Points spent calculation (earnedPoints - currentPoints)
  const pointsSpent = computed(() => earnedPoints.value - currentPoints.value);
  
  onMounted(async () => {
    if (userId) {
      try {
        const response = await userService.getUserById(userId);
        if (response.data) {
          user.value = response.data;
          console.log("User data:", user.value);
        }
  
        const studentInfo = await studentInfoServices.getStudentInfoById(userId);
        if (studentInfo.data.length > 0) {
          earnedPoints.value = studentInfo.data[0].earnedPoints;
          currentPoints.value = studentInfo.data[0].currentPoints;
        }
  
        // Check if majorId exists in user data, if not, log it
        if (user.value.majorId) {
          const majorResponse = await majorService.getMajorById(user.value.majorId);
          
          if (majorResponse.data) {
            majorName.value = majorResponse.data.name;
            departmentName.value = majorResponse.data.dept;
          } else {
            console.error('Major data not found for majorId:', user.value.majorId);
          }
        } else {
          console.error('No majorId found for user:', userId);
        }
  
        const leaderboardData = await leaderboardService.getSortedStudentsByClass(userId);
        let rankCounter = 0;
        leaderboardData.data.forEach((student, index) => {
          if (student.id === userId && index === 0) {
            timesAtTop.value++;
            pointsAtTop.value = student.earnedPoints;
          }
        });
      } catch (error) {
        console.error('Error fetching user or student info:', error);
      }
    }
  });
  </script>
  
  