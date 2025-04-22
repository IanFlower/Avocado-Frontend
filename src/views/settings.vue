<script setup>
import { onMounted, ref, computed } from 'vue';
import userService from '../services/userServices.js';
import NoImageAvailable from '../assets/No_Image_Found.png';
import iconServices from '../services/iconServices.js';
import cliftonStrengthService from '../services/cliftonStrengthServices';
import majorService from '../services/majors.Services';
import studentInfoServices from '../services/studentInfoServices';

// LocalStorage user
const storedUser = JSON.parse(localStorage.getItem("user"));
const userId = storedUser?.id;

// User and Student Info
const user = ref({
  fName: '',
  lName: '',
  email: '',
  profilePicture: ''
});
const studentInfo = ref(null);

// Classification Computed
const classification = computed(() => {
  const sem = user.value.semestersTillGraduation;
  if (sem >= 7) return 'Freshman';
  if (sem >= 5) return 'Sophomore';
  if (sem >= 3) return 'Junior';
  if (sem >= 1) return 'Senior';
  return '';
});

// Strengths and Majors
const cliftonStrengths = ref([]);
const selectedStrengths = ref([]);
const showStrengthDialog = ref(false);
const userTopStrengths = ref([]);


const majors = ref([]);
const selectedMajor = ref(null);
const showMajorDialog = ref(false);

const showSemesterDialog = ref(false);
const newSemester = ref(null);


// Mounted: Fetch all data
onMounted(async () => {
  try {
    // Get user
    const userRes = await userService.getUserById(userId);
    if (userRes.data) {
      user.value = userRes.data;

      if (user.value.profilePicture && !user.value.profilePicture.startsWith('http')) {
        try {
          const iconRes = await iconServices.getIconByFile(user.value.profilePicture);
          user.value.profilePicture = `data:image/*;base64,${iconRes.data}`;
        } catch (err) {
          console.error("Error fetching profile picture:", err.message);
          user.value.profilePicture = '';
        }
      }
    }

    // Get student info
    const studentRes = await studentInfoServices.getStudentInfoById(userId);
    if (studentRes.data) {
      studentInfo.value = studentRes.data;
    }

    // Get strengths
    try {
      const result = await cliftonStrengthService.getAllCliftonStrengths();
      cliftonStrengths.value = result.data;
    } catch (e) {
      console.error("Failed to fetch strengths", e);
    }

    // Get majors
    try {
      const res = await majorService.getAllMajors();
      majors.value = res.data;
    } catch (err) {
      console.error('Failed to fetch majors', err);
    }

  } catch (error) {
    console.error('Error fetching user or student info:', error);
  }
});

function submitStrengths() {
  if (selectedStrengths.value.length > 5) return;

  // Simulate saving by mapping selected IDs to full strength objects
  userTopStrengths.value = cliftonStrengths.value.filter(str =>
    selectedStrengths.value.includes(str.id)
  );

  showStrengthDialog.value = false;

  console.log('User Top Strengths:', userTopStrengths.value.map(s => s.name));
}


function submitMajor() {
  if (selectedMajor.value) {
    console.log("Selected major:", selectedMajor.value);
    // Save to backend if needed
  }
  showMajorDialog.value = false;
}

async function submitSemester() {
  if (newSemester.value && studentInfo.value) {
    try {
      const updated = {
        ...studentInfo.value,
        semestersTillGraduation: newSemester.value
      };

      await studentInfoServices.updateStudentInfo(userId, updated);
      studentInfo.value.semestersTillGraduation = newSemester.value;
      showSemesterDialog.value = false;
    } catch (err) {
      console.error("Failed to update semester:", err);
    }
  }
}

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
          </v-col>
        </v-row>
      </v-col>
    </v-row>


    <v-row justify="center" class="mt-6">
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center d-flex flex-column justify-space-between" outlined style="height: 360px;">
          <div>
            <v-card-title class="text-h6 font-weight-medium">Clifton Strengths</v-card-title>
            <v-divider class="my-2" />

            <div v-if="userTopStrengths.length > 0" class="mt-3 text-left px-4">
              <div class="text-subtitle-2 font-weight-bold mb-2">Your Top 5 Clifton Strengths:</div>
              <ul class="text-left pl-4">
                <li v-for="s in userTopStrengths" :key="s.id" class="text-body-2">{{ s.name }}</li>
              </ul>
            </div>
          </div>

          <v-card-actions class="justify-center">
            <v-btn class="tertiary-button" height="60" width="250" size="large" variant="outlined"
              @click="showStrengthDialog = true" style="font-size: 18px;">
              Give Your Top 5!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>


      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center d-flex flex-column justify-space-between" outlined style="height: 360px;">
          <div>
            <v-card-title class="text-h6 font-weight-medium">Majors</v-card-title>
            <v-divider class="my-2" />
            <v-card-subtitle v-if="selectedMajor" class="text-h6 font-weight-medium text-center mt-2">
              Your Current Major is : {{ selectedMajor.name }}
            </v-card-subtitle>
          </div>
          <v-card-actions class="justify-center">
            <v-btn class="tertiary-button" height="60" width="250" size="large" variant="outlined"
              @click="showMajorDialog = true" style="font-size: 18px;">
              Change Major
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center d-flex flex-column justify-space-between" outlined style="height: 360px;">
          <div>
            <v-card-title class="text-h6 font-weight-medium justify-center d-flex text-center">
              Edit Graduation Semester
            </v-card-title>
            <v-divider class="my-2" />
            <v-card-subtitle v-if="studentInfo?.semestersTillGraduation"
              class="text-h6 font-weight-medium text-center mt-2">
              Your Semesters Till Graduation Is Now : {{ studentInfo.semestersTillGraduation }}
            </v-card-subtitle>
          </div>
          <v-card-actions class="justify-center">
            <v-btn class="tertiary-button" height="60" width="450" size="large" variant="outlined"
              @click="showSemesterDialog = true" style="font-size: 18px;">
              Change Graduation Semester
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>



    <!-- V- DIALOGS FOR THE ABOVE -->

    <v-dialog v-model="showStrengthDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h5">Choose Your Top 5 Clifton Strengths</v-card-title>
        <v-card-text>
          <v-select label="Select Strengths" v-model="selectedStrengths" :items="cliftonStrengths" item-value="id"
            item-title="name" multiple chips clearable
            :rules="[v => v.length <= 5 || 'Select up to 5 strengths only']" />
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="showStrengthDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="submitStrengths">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showMajorDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Select Your Major</v-card-title>
        <v-card-text>
          <v-select v-model="selectedMajor" :items="majors" item-title="name" item-value="id" label="Choose a Major"
            clearable return-object />
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="showMajorDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" color="primary" @click="submitMajor">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showSemesterDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Select New Graduation Semester</v-card-title>
        <v-card-text>
          <v-select v-model="newSemester" :items="[8, 7, 6, 5, 4, 3, 2, 1]" label="Semesters till Graduation"
            return-object />
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="showSemesterDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" color="primary" @click="submitSemester">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-container>
</template>
