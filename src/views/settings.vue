<script setup>
import { ref, onMounted } from 'vue';
import userService from '../services/userServices';
import iconServices from '../services/iconServices';
import cliftonStrengthService from '../services/cliftonStrengthServices';
import majorService from '../services/majors.Services';
import studentInfoServices from '../services/studentInfoServices';
import studentInfoMajorService from '../services/studentInfoMajorServices';

const storedUser = JSON.parse(localStorage.getItem("user"));
const userId = storedUser?.id;

const user = ref({ fName: '', lName: '', email: '', profilePicture: '' });
const studentInfo = ref(null);
const cliftonStrengths = ref([]);
const selectedStrengths = ref(['', '', '', '', '']);
const showDropdown = ref([false, false, false, false, false]);

const majors = ref([]);
const selectedMajors = ref([]);
const semesterOptions = [
  { value: 8, label: "8 - Freshman Fall" },
  { value: 7, label: "7 - Freshman Spring" },
  { value: 6, label: "6 - Sophomore Fall" },
  { value: 5, label: "5 - Sophomore Spring" },
  { value: 4, label: "4 - Junior Fall" },
  { value: 3, label: "3 - Junior Spring" },
  { value: 2, label: "2 - Senior Fall" },
  { value: 1, label: "1 - Senior Spring" },
];
const newSemester = ref(null);
const studentIdInput = ref('');

const activeTab = ref('Strengths');

onMounted(async () => {
  const userRes = await userService.getUserById(userId);
  if (userRes.data) {
    user.value = userRes.data;
    if (user.value.profilePicture && !user.value.profilePicture.startsWith('http')) {
      try {
        const iconRes = await iconServices.getIconByFile(user.value.profilePicture);
        user.value.profilePicture = `data:image/*;base64,${iconRes.data}`;
      } catch {
        user.value.profilePicture = '';
      }
    }
  }

  const studentRes = await studentInfoServices.getStudentInfoById(userId);
  if (studentRes.data) {
    studentInfo.value = studentRes.data;
    newSemester.value = studentRes.data.semestersTillGraduation;
    studentIdInput.value = studentRes.data.studentId || '';
  }

  const strengthsRes = await cliftonStrengthService.getAllCliftonStrengths();
  cliftonStrengths.value = strengthsRes.data.map(s => s.name);

  const majorsRes = await majorService.getAllMajors();
  majors.value = majorsRes.data;

  // Populate selected majors
  const studentMajorRes = await studentInfoMajorService.getAllByStudentInfoId(userId);

  if (studentMajorRes.data && Array.isArray(studentMajorRes.data)) {
    selectedMajors.value = studentMajorRes.data.map((m) => m.majorId);
  }
});

const toggleDropdown = (index) => {
  showDropdown.value = showDropdown.value.map((val, i) => i === index ? !val : false);
};

const setStrength = (index, strength) => {
  selectedStrengths.value[index] = strength;
  showDropdown.value[index] = false;
};

async function saveStrengths() {
  try {
    for (let i = 0; i < selectedStrengths.value.length; i++) {
      const strength = selectedStrengths.value[i];
      if (strength && strength.trim() !== '') {
        await cliftonStrengthService.updateCliftonStrength(i + 1, { name: strength });
      }
    }
    alert("Clifton Strengths updated successfully.");
  } catch (error) {
    console.error("Failed to update strengths:", error);
    alert("Failed to update strengths.");
  }
}


async function saveProfileChanges() {
  try {
    await studentInfoServices.updateStudentInfo(userId, {
      studentId: studentIdInput.value,
      semestersTillGraduation: newSemester.value
    });

    for (const major of selectedMajors.value) {
      await studentInfoMajorService.update(userId, {
        studentInfoId: userId,
        majorId: major.id
      });
    }


    alert("Profile updated successfully.");
  } catch (error) {
    console.error("Failed to update profile:", error);
    alert("Failed to update profile.");
  }
}


</script>

<template>
  <v-container class="pa-8">
    <p class="text-h3 font-weight-bold mb-6">Settings</p>

    <!-- Tertiary-Style Button Tabs -->
    <v-row class="mt-4 mb-6">
      <v-btn-toggle v-model="activeTab" class="d-flex flex-wrap" mandatory>
        <v-btn class="tertiary-button mx-2" size="large" value="Strengths">Strengths</v-btn>
        <v-btn class="tertiary-button mx-2" size="large" value="Profile">Profile</v-btn>
      </v-btn-toggle>
    </v-row>

    <!-- Tab Contents -->
    <v-tabs-window v-model="activeTab">
      <!-- Strengths Tab -->
      <v-tabs-window-item value="Strengths">
        <v-row class="mt-10" justify="center">
          <v-col cols="12" sm="6">
            <v-card class="pa-6" elevation="1">
              <p class="text-h6 font-weight-medium mb-6 text-center">Your Top 5 Clifton Strengths</p>
              <v-row dense>
                <v-col cols="12" v-for="(strength, index) in selectedStrengths" :key="index" class="mb-4">
                  <v-text-field :label="`Strength #${index + 1}`" v-model="selectedStrengths[index]"
                    @click="toggleDropdown(index)" readonly variant="outlined" />
                  <v-list v-if="showDropdown[index]" class="elevation-2">
                    <v-list-item v-for="s in cliftonStrengths" :key="s" @click="setStrength(index, s)">
                      {{ s }}
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
              <v-row class="mt-4" justify="center" v-if="selectedStrengths.some(s => s && s.trim() !== '')">
                <v-col cols="12" sm="6">
                  <v-card-actions class="justify-space-between">
                    <v-btn text color="secondary-button">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text color="blue darken-1" @click="saveStrengths">Save</v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>


            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>

      <!-- Profile Tab -->
      <v-tabs-window-item value="Profile">
        <v-row class="mt-6">
          <v-col cols="12" class="text-center mb-4">
            <v-avatar size="180" class="elevation-2">
              <v-img :src="user.profilePicture" alt="Profile" />
            </v-avatar>
            <p class="text-h5 font-weight-medium mt-4">{{ user.fName }} {{ user.lName }}</p>
            <p class="text-subtitle-1">{{ user.email }}</p>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <v-row class="mt-4">
          <v-col cols="12" class="mb-4">
            <v-select v-model="selectedMajors" :items="majors" item-title="name" item-value="id" label="Majors" multiple
              chips clearable />
          </v-col>

          <v-col cols="12" class="mb-4">
            <v-select v-model="newSemester" :items="semesterOptions" item-title="label" item-value="value"
              label="Semesters Till Graduation" clearable />
          </v-col>

          <v-col cols="12" class="mb-4">
            <v-text-field v-model="studentIdInput" label="Student ID (7-digit)" maxlength="7" type="number"
              variant="outlined" />
          </v-col>

          <v-col cols="12">
            <v-card-actions class="mt-2">
              <v-btn text color="secondary-button">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="saveProfileChanges" text color="blue darken-1">Save</v-btn>
            </v-card-actions>
          </v-col>

        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<style scoped>
.v-list {
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  background-color: white;
  z-index: 5;
  width: 100%;
}
</style>
