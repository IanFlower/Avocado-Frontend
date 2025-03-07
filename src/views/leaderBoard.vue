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
          <v-card :class="{'highlight-user': student.id === loggedInUserId}" outlined class="leaderboard-card">
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
                  <p class="text-h4 font-weight-bold">{{ student.name }}</p>
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
import { ref, onMounted } from "vue";
import roleUserServices from "../services/RoleUserServices";
import studentInfoServices from "../services/studentInfoServices";
import Utils from "../config/utils";

// State for students data
const students = ref([]);
const storedUser = Utils.getStore("user"); // Retrieve user from local storage
const loggedInUserId = ref(storedUser.id); 

// Fetch users based on role
const fetchUsers = () => {
  return roleUserServices.getUsersByRoleId(1)
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching users:", error);
      throw error;
    });
};

// Fetch student info based on ID
const fetchStudentInfo = (user) => {
  return studentInfoServices.getStudentInfoById(user.id)
    .then(infoResponse => {
      const studentInfo = infoResponse.data[0];
      return {
        id: user.id,
        name: `${user.fName} ${user.lName}`,
        major: studentInfo.major || "Unknown Major",
        earnedPoints: studentInfo.earnedPoints,
        initials: `${user.fName[0]}${user.lName[0]}`,
        profilePicture: user.profilePicture || null
      };
    })
    .catch(error => {
      console.error(`Error fetching info for user ${user.id}:`, error);
      throw error;
    });
};

// Sort and fetch all students
const getStudents = () => {
  fetchUsers()
    .then(users => {
      const studentPromises = users.map(user => fetchStudentInfo(user));
      return Promise.all(studentPromises);
    })
    .then(studentData => {
      students.value = studentData.sort((a, b) => b.earnedPoints - a.earnedPoints);
    })
    .catch(error => {
      students.value = [];
      console.error("Error processing students:", error);
    });
};

// Assign rank color classes
const getRankClass = (rank) => {
  if (rank === 0) return "gold-rank";
  if (rank === 1) return "silver-rank";
  if (rank === 2) return "bronze-rank";
  return "default-rank";
};

// Fetch students when the component is mounted
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
