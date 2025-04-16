<script setup>
import { onMounted, ref, computed } from 'vue';
import userService from '../services/userServices.js';
import studentInfoServices from '../services/studentInfoServices.js';
import leaderboardService from '../services/leaderboardServices.js';
import majorService from '../services/majors.Services.js';
import studentInfoMajorService from '../services/studentInfoMajorServices.js';
import badgeService from '../services/badgeServices.js';
import userBadgesServices from '../services/userBadgesServices.js';
import studentPurchaseService from '../services/studentPurchaseServices.js';
import Utils from '../config/utils.js';
import iconServices from '../services/iconServices.js';
import NoImageAvailable from '../assets/No_Image_Found.png';

const user = ref({
  fName: '',
  lName: '',
  email: '',
  profilePicture: '',
  majorId: null,
});

const earnedPoints = ref(0);
const currentPoints = ref(0);
const majorName = ref('');
const departmentName = ref('');
const classification = ref('');
const recentPurchases = ref([]);

const userId = Utils.getStore('user') ? Utils.getStore('user').id : null;

const badges = ref([]);
const currentIndex = ref(0);

const completedBadges = computed(() =>
  badges.value.filter(badge => badge.earned)
);

function prevBadge() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function nextBadge() {
  if (currentIndex.value < completedBadges.value.length - 1) {
    currentIndex.value++;
  }
}

onMounted(async () => {
  if (userId) {
    try {
      const response = await userService.getUserById(userId);
      if (response.data) user.value = response.data;

      const studentInfo = await studentInfoServices.getStudentInfoById(userId);
      if (studentInfo.data.length > 0) {
        earnedPoints.value = studentInfo.data[0].earnedPoints;
        currentPoints.value = studentInfo.data[0].currentPoints;

        const semestersTillGraduation = studentInfo.data[0].semestersTillGraduation;
        classification.value = semestersTillGraduation <= 2 ? "Senior"
          : semestersTillGraduation <= 4 ? "Junior"
            : semestersTillGraduation <= 6 ? "Sophomore"
              : "Freshman";

        const studentId = studentInfo.data[0].id;

        // BADGE FETCHING LOGIC
        const allBadges = await badgeService.getAllBadges();
        const earnedRes = await userBadgesServices.getByStudentId(studentId);
        const earnedBadges = earnedRes?.data?.map(b => b.badgeId) || [];

        badges.value = allBadges.data.map(badge => ({
          ...badge,
          earned: earnedBadges.includes(badge.id),
          image: badge.image || null
        }));

        for (const badge of badges.value) {
          if (badge.image) {
            try {
              const icon = await iconServices.getIconByFile(badge.image);
              badge.image = icon.data;
            } catch (error) {
              console.error("Error fetching badge image:", error.message);
              badge.image = null;
            }
          }
        }
      }

      const studentInfoMajor = await studentInfoMajorService.getAllByStudentInfoId(userId);
      const majorNamesSet = new Set();
      const departmentNamesSet = new Set();

      if (studentInfoMajor.data.length > 0) {
        for (const major of studentInfoMajor.data) {
          try {
            let m = await majorService.getMajorById(major.majorId);
            if (m.data) {
              majorNamesSet.add(m.data.name);
              departmentNamesSet.add(m.data.dept);
            }
          } catch (err) {
            console.error("Error fetching major details:", err);
          }
        }
      }

      majorName.value = Array.from(majorNamesSet).join(', ');
      departmentName.value = Array.from(departmentNamesSet).join(', ');

      const purchaseRes = await studentPurchaseService.getRecentPurchases(userId);
      if (purchaseRes.data) {
        recentPurchases.value = purchaseRes.data.slice(0, 3);
      }

    } catch (error) {
      console.error('Error fetching user or student info:', error);
    }
  }
});
</script>

<template>
  <v-container fluid class="mt-10">
    <v-row justify="center">
      <v-col cols="12" sm="10" class="d-flex justify-center">
        <v-row align="center" class="w-100">
          <v-col cols="12" sm="4" class="d-flex justify-center">
            <v-avatar size="300" class="overflow-hidden">
              <v-img :src="user.profilePicture || NoImageAvailable" alt="Profile Picture" cover class="elevation-1"
                lazy-src="https://via.placeholder.com/300" />
            </v-avatar>

          </v-col>

          <v-col cols="12" sm="8" class="d-flex flex-column justify-center align-center">
            <div v-if="user.fName && user.lName" class="text-h3 font-weight-bold text-center">
              {{ `${user.fName} ${user.lName}` }}
            </div>
            <div v-if="user.email" class="text-subtitle-1 font-italic text-center">{{ user.email }}</div>

            <div v-if="classification" class="text-h6 font-weight-bold mt-2 text-center">
              Classification: {{ classification }}
            </div>
            <div v-if="majorName" class="text-h6 font-weight-bold mt-2 text-center">Major: {{ majorName }}</div>
            <div v-if="departmentName" class="text-subtitle-2 text-center">Department: {{ departmentName }}</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row justify="center" align="center" class="mt-4" no-gutters>
      <!-- Point Stats -->
      <v-col cols="12" md="5" class="d-flex justify-center mb-4 mx-2">
        <v-card class="pa-6 tertiary rounded-xl" max-width="100%" width="100%">
          <v-card-title class="text-h4 text-center">Point Stats</v-card-title>
          <v-card-text class="text-center">
            <v-divider class="my-4"></v-divider>
            <div class="mt-4">
              <div class="text-h4 mb-2">Recent Purchases:</div>
              <div v-if="recentPurchases.length === 0">No recent purchases found.</div>
              <div v-else>
                <div v-for="(purchase, index) in recentPurchases" :key="index" class="text-h4">
                  • {{ purchase.reward?.name || 'Unknown Reward' }}
                  {{ typeof purchase.reward?.requiredPoints === 'number' ? purchase.reward.requiredPoints : 'N/A' }}
                  points
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Badges -->
      <v-col cols="12" md="5" class="d-flex justify-center mb-4 mx-2">
        <v-card class="pa-6 tertiary rounded-xl" max-width="100%" width="100%">
          <v-card-title class="text-h4 text-center">Badges Collected</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <v-row align="center" justify="center" class="d-flex">
              <v-col cols="2" class="d-flex justify-center">
                <v-icon @click="prevBadge" :class="{ 'text-disabled': currentIndex === 0 }" style="cursor: pointer;">
                  mdi-chevron-left
                </v-icon>
              </v-col>

              <v-col cols="8" class="d-flex flex-column align-center">
                <div class="text-h5 mb-2" v-if="completedBadges.length > 0">
                  {{ completedBadges[currentIndex].name }}
                </div>
                <v-img v-if="completedBadges.length > 0"
                  :src="completedBadges[currentIndex].image ? `data:image/*;base64,${completedBadges[currentIndex].image}` : NoImageAvailable"
                  height="400px" width="400px" class="rounded" cover></v-img>
                <div v-else class="text-subtitle-1 mt-2">No completed badges yet.</div>
              </v-col>

              <v-col cols="2" class="d-flex justify-center">
                <v-icon @click="nextBadge" :class="{ 'text-disabled': currentIndex === completedBadges.length - 1 }"
                  style="cursor: pointer;">
                  mdi-chevron-right
                </v-icon>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
