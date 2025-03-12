<template>
  <v-container>
    <!-- Title Section -->
    <v-card-title class="text-h4 text-center font-weight-bold">
      Top Point Leaders
    </v-card-title>

    <!-- Divider Section -->
    <v-card-text>
      <v-divider></v-divider>

      <!-- Students List Section -->
      <v-row class="d-flex justify-center align-center" no-gutters>
        <v-col cols="12" md="6" v-for="(student, index) in students" :key="student.id">
          <v-card :class="{'highlight-user': student.id === loggedInUserId.value}" outlined class="leaderboard-card">
            <v-row align="center" no-gutters>
              
              <!-- Rank Section with Colored Backgrounds -->
              <v-col cols="2" class="text-center">
                <v-avatar :class="getRankClass(index)" class="rank-badge">
                  <span class="text-h6 white--text">{{ index + 1 }}</span> 
                </v-avatar>
              </v-col>

              <!-- Student Info Section -->
              <v-col>
                <v-card-text class="pt-2">
                  <p class="text-h4 font-weight-bold">
                    {{ student.fname }} {{ student.lname }}
                  </p>
                  <p class="text-subtitle-2">{{ student.major }}</p> 
                </v-card-text>
              </v-col>

              <!-- Points Section -->
              <v-col cols="3" class="text-right">
                <p class="text-h6 font-weight-bold points-text">{{ student.earnedPoints }} points</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import leaderboardService from "../services/leaderboardServices";
import Utils from "../config/utils";

// State for students data
const students = ref([]);
const storedUser = Utils.getStore("user");
const loggedInUserId = ref(storedUser.id);


const getStudents = () => {
  leaderboardService.getAll().then((response) => {
    students.value = response.data.map(student => ({
      id: student.id,
      fname: student.fname,
      lname: student.lname,
      major: student.major,
      earnedPoints: student.earnedPoints
    })).sort((a, b) => b.earnedPoints - a.earnedPoints); 
  }).catch((error) => {
    console.error("Error fetching leaderboard data:", error);
  });
};

const getRankClass = (rank) => {
  if (rank === 0) return "gold-rank";
  if (rank === 1) return "silver-rank";
  if (rank === 2) return "bronze-rank";
  return "default-rank";
};

onMounted(() => {
  getStudents();
});
</script>

<style scoped>
.leaderboard-card {
  background-color: #f4f4f4;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
}

.rank-badge {
  width: 40px;
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gold-rank {
  background-color: #FFD700; 
  color: white;
}

.silver-rank {
  background-color: #C0C0C0; 
  color: white;
}

.bronze-rank {
  background-color: #CD7F32; 
  color: white;
}

.default-rank {
  background-color: #b71c1c;
  color: white;
}

.points-text {
  color: #76b900;
  font-weight: bold;
}

.highlight-user {
  background-color: #D5DFE7 !important; /* Highlight color */
}
</style>
