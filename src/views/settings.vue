<script setup>
import { onMounted, ref } from 'vue';
import userService from '../services/userServices.js';
import NoImageAvailable from '../assets/No_Image_Found.png';

const user = ref({
  fName: '',
  lName: '',
  email: '',
  profilePicture: ''
});

onMounted(async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }

    const response = await userService.getUserById(userId);
    if (response.data) {
      user.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
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
              <v-img
                :src="user.profilePicture || NoImageAvailable"
                alt="Profile Picture"
                cover
                class="elevation-1"
              />
            </v-avatar>
          </v-col>

          <v-col cols="12" sm="8" class="d-flex flex-column justify-center align-center">
            <div v-if="user.fName && user.lName" class="text-h3 font-weight-bold text-center">
              {{ `${user.fName} ${user.lName}` }}
            </div>
            <div v-if="user.email" class="text-subtitle-1 font-italic text-center">
              {{ user.email }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
