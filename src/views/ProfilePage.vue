<script setup>
import { onMounted, ref, computed } from 'vue';
import userService from '../services/userServices.js';
import studentInfoServices from '../services/studentInfoServices.js';
import leaderboardService from '../services/leaderboardServices.js';
import majorService from '../services/majors.Services.js';
import studentInfoMajorService from '../services/studentInfoMajorServices.js';
import badgeService from '../services/badgeServices.js';
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
const timesAtTop = ref(0);
const pointsAtTop = ref(0);
const majorName = ref('');
const departmentName = ref('');
const classification = ref('');
const recentPurchases = ref([]);

const userId = Utils.getStore('user') ? Utils.getStore('user').id : null;

const badgesList = computed(() => badge.value.filter(badge => {
  if (search.value == '') return true;
  return badge.name.toLowerCase().includes(search.value.toLowerCase())
}));

const badges = ref([]);

const semesters = [
  'Freshman Fall Semester',
  'Freshman Spring Semester',
  'Sophomore Fall Semester',
  'Sophomore Spring Semester',
  'Junior Fall Semester',
  'Junior Spring Semester',
  'Senior Fall Semester',
  'Senior Spring Semester'
];

const selectedSemesterPoints = ref(0);
const selectedSemesterLeaderboard = ref(0);
const selectedSemesterBadges = ref(0);

const nextSemesterPoints = () => {
  if (selectedSemesterPoints.value < semesters.length - 1) selectedSemesterPoints.value++;
};
const prevSemesterPoints = () => {
  if (selectedSemesterPoints.value > 0) selectedSemesterPoints.value--;
};
const nextSemesterLeaderboard = () => {
  if (selectedSemesterLeaderboard.value < semesters.length - 1) selectedSemesterLeaderboard.value++;
};
const prevSemesterLeaderboard = () => {
  if (selectedSemesterLeaderboard.value > 0) selectedSemesterLeaderboard.value--;
};
const nextSemesterBadges = () => {
  if (selectedSemesterBadges.value < semesters.length - 1) selectedSemesterBadges.value++;
};
const prevSemesterBadges = () => {
  if (selectedSemesterBadges.value > 0) selectedSemesterBadges.value--;
};

const pointsSpent = computed(() => earnedPoints.value - currentPoints.value);

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

      const leaderboardData = await leaderboardService.getSortedStudentsByClass(userId);
      leaderboardData.data.forEach((student, index) => {
        if (student.id === userId && index === 0) {
          timesAtTop.value++;
          pointsAtTop.value = student.earnedPoints;
        }
      });

      const purchaseRes = await studentPurchaseService.getRecentPurchases(userId);
      if (purchaseRes.data) {
        recentPurchases.value = purchaseRes.data.slice(0, 3);
      }

    } catch (error) {
      console.error('Error fetching user or student info:', error);
    }

    try {
      const response = await badgeService.getAllBadges();
      badges.value = response.data;
      badges.value.forEach(badge => {
        if (badge.image) {
          iconServices.getIconByFile(badge.image).then(icon => {
            if (icon.data) {
              badge.image = icon.data;
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

<template>
  <v-container fluid class="mt-10">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" class="d-flex justify-center">
        <v-card class="pa-4" width="100%">
          <v-row align="center">
            <v-col cols="12" sm="3" class="d-flex justify-start">
              <v-avatar size="250" class="overflow-hidden">
                <v-img :src="user.profilePicture || NoImageAvailable" alt="Profile Picture"
                  style="object-fit: contain; image-rendering: crisp-edges; " />
              </v-avatar>

            </v-col>

            <v-col cols="12" sm="9" class="d-flex flex-column justify-center">
              <div v-if="user.fName && user.lName" class="text-h3 font-weight-bold">{{ `${user.fName} ${user.lName}` }}
              </div>
              <div v-if="user.email" class="text-subtitle-1 font-italic">{{ user.email }}</div>

              <div v-if="classification" class="text-h6 font-weight-bold mt-2">Classification: {{ classification }}
              </div>
              <div v-if="majorName" class="text-h6 font-weight-bold mt-2">Major: {{ majorName }}</div>
              <div v-if="departmentName" class="text-subtitle-2">Department: {{ departmentName }}</div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-row justify="space-between" align="center" no-gutters>
            <!-- Point Stats -->
            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-card class="pa-4 tertiary rounded-xl" max-width="350px" width="100%"
                style="background-color: #98FB98;">
                <v-card-title class="text-h5 text-center">Point Stats</v-card-title>
                <v-card-subtitle class="text-center">
                  <v-btn @click="prevSemesterPoints" icon
                    style="background-color: transparent; border-radius: 50%; padding: 0;">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <span>{{ semesters[selectedSemesterPoints] }}</span>
                  <v-btn @click="nextSemesterPoints" icon
                    style="background-color: transparent; border-radius: 50%; padding: 0;">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-card-subtitle>
                <v-card-text class="text-center">
                  <v-divider class="my-4"></v-divider>
                  <div class="mt-4">
                    <div class="text-h6 mb-2">Recent Purchases:</div>
                    <div v-if="recentPurchases.length === 0">No recent purchases found.</div>
                    <div v-else>
                      <div v-for="(purchase, index) in recentPurchases" :key="index" class="text-subtitle-1">
                        • {{ purchase.name }} - {{ purchase.requiredPoints }} points
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Leaderboard Stats -->
            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-card class="pa-4 tertiary rounded-xl" max-width="350px" width="100%"
                style="background-color: #98FB98;">
                <v-card-title class="text-h5 text-center">Leaderboard Stats</v-card-title>
                <v-card-subtitle class="text-center">
                  <v-btn @click="prevSemesterLeaderboard" icon
                    style="background-color: transparent; border-radius: 50%; padding: 0;">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <span>{{ semesters[selectedSemesterLeaderboard] }}</span>
                  <v-btn @click="nextSemesterLeaderboard" icon
                    style="background-color: transparent; border-radius: 50%; padding: 0;">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-card-subtitle>
                <v-card-text class="text-center">
                  <p class="text-h6"><strong>#1 Rank Achievements:</strong> {{ timesAtTop }} times</p>
                  <p class="text-h6"><strong>Points at #1:</strong> {{ pointsAtTop }} points</p>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Badges -->
            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-card class="pa-4 tertiary rounded-xl" max-width="350px" width="100%">
                <v-card-title class="text-h5 text-center">Badges Collected</v-card-title>
                <v-card-subtitle class="text-center">
                  <v-btn @click="prevSemesterBadges" icon
                    style="background-color: transparent; border-radius: 50%; padding: 0;">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <span>{{ semesters[selectedSemesterBadges] }}</span>
                  <v-btn @click="nextSemesterBadges" icon
                    style="background-color: transparent; border-radius: 50%; padding: 0;">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-card-subtitle>
                <v-card-text class="text-center">
                  <div class="text-h6">Earned This Semester:</div>
                  <v-row justify="center" class="d-flex">
                    <v-col v-for="(badge, index) in badges" :key="index" cols="4" class="d-flex justify-center"
                      style="margin-bottom: 10px;">
                      <v-img :src="badge.image ? `data:image/*;base64,${badge.image}` : NoImageAvailable" cover
                        :max-height="'150px'" width="auto"></v-img>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
