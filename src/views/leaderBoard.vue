<template>
  <v-container>
    <v-card-title class="text-h1 text-center">
      Top Point Leaders
    </v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="5" md="5" class="pa-6 ma-6">
          <v-card outlined class="bg-secondary">
            <v-row v-for="(student, index) in students" :key="student.id">
              <v-col cols="2">
                <v-card class="bg-primary fill-height pa-4 text-center">
                  <span class="text-h2">{{ index + 1 }}</span>
                </v-card>
              </v-col>

              <v-col cols="2">
                <v-avatar size="150">
                  <img :src="student.profilePicture" alt="Profile Picture">
                </v-avatar>
              </v-col>
              <v-col>
                <v-card-title class="text-h3 font-weight-bold">{{ student.name }}</v-card-title>
                <v-card-text>
                  {{ student.major }}
                  <v-spacer></v-spacer>
                  <p>{{ student.points }} points</p>
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
  roleUserServices.getUsersByRoleId(1)
    .then(response => {
      const users = response.data;
      const studentPromises = users.map(user => 
        studentInfoServices.getStudentInfoById(user.id)
          .then(infoResponse => ({
            id: user.id,
            name: `${user.fName} ${user.lName}`,
            profilePicture: infoResponse.data.profilePicture,
            points: infoResponse.data.points 
          }))
      );
      return Promise.all(studentPromises);
    })
    .then(studentData => {
      students.value = studentData;
    })
    .catch(error => {
      students.value = [];
    });
};

onMounted(() => {
  getStudents();
});
</script>

<style scoped>
</style>
