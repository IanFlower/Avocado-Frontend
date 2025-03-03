<template>
  <v-container>
    <!-- Title Section -->
    <v-card-title class="text-h1 text-center">
      Top Point Leaders
    </v-card-title>

    <!-- Divider Section -->
    <v-card-text>
      <v-divider></v-divider>

      <!-- Students List Section -->
      <v-row>
        <v-col cols="5" md="5" class="pa-6 ma-6" v-for="(student, index) in students" :key="student.id">
          <v-card outlined class="bg-secondary">
            <v-row>
              <!-- Rank Section -->
              <v-col cols="2">
                <v-card class="bg-primary fill-height pa-4 text-center">
                  <span class="text-h2">{{ index + 1 }}</span>
                </v-card>
              </v-col>

              <!-- Avatar Section -->
              <v-col cols="2">
                <v-avatar size="150">
                  <img :src="student.profilePicture" alt="Profile Picture">
                </v-avatar>
              </v-col>

              <!-- Student Info Section -->
              <v-col>
                <v-card-text class="pt-8 d-flex justify-center align-center">
                  <p class="text-h3 font-weight-bold mt-4">{{ student.name }}</p>
                  <v-spacer></v-spacer>
                  <p style="color: #99AD00;" class="text-h4">{{ student.earnedPoints }} points</p> 
                </v-card-text>
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

const students = ref([]);
const error = ref(null);

const getStudents = () => {
  // Fetch users with role ID 1 (students) from the roleUserServices
  roleUserServices.getUsersByRoleId(1)
    .then(response => {
      const users = response.data;
      console.log('Users:', users); 
      const studentPromises = users.map(user => 
        studentInfoServices.getStudentInfoById(user.id)
          .then(infoResponse => {
            const studentInfo = infoResponse.data[0];  
            return {
              id: user.id,
              name: `${user.fName} ${user.lName}`,
              earnedPoints: studentInfo.earnedPoints,
              profilePicture: user.profilePicture, 
            }; 
          })
      );
      return Promise.all(studentPromises);
    })
    .then(studentData => {
      // Sort students by earned points in descending order 
      students.value = studentData.sort((a, b) => b.earnedPoints - a.earnedPoints); 
    })
    .catch(error => {
      students.value = [];
      console.error(error);
    });
};

// Fetch students when the component is mounted
onMounted(() => {
  getStudents();
  console.log("students:", students); 
}); 
</script>

<style scoped>
</style>
