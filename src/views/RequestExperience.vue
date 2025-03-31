<template>
  <v-container class="">
    <v-row>
      <!-- Title Section -->
      <v-col cols="12" class="text-center">
        <h1>Request New Experience</h1>
      </v-col>

      <!-- Description Section -->
      <v-col cols="12" class="text-center">
        <p class="mb-4">
          If you have completed an experience that you believe has contributed to your professional development, you can request 
          that experience to be counted on your Flight Plan. And you can earn points! Requested 
          Experiences will be reviewed by Career Services staff and approved if they are deemed valid professional development.
        </p>
      </v-col>

      <!-- Button Section -->
      <v-col cols="12" class="text-center mb-8">
        <v-btn color="secondary" @click="showDialog()">+ Request Experience</v-btn>
      </v-col>
    </v-row>

    <!-- Cards Section -->
    <v-row class="mt-auto" justify="space-between">
      <!-- Pending Requests -->
      <v-col cols="5">
        <v-card class="pa-4" style="height: 400px; width: 100%;">
          <v-card-title color="secondary">Pending Requests</v-card-title>
          <v-row no-gutters>
            <v-list class="overflow-y-auto w-100" max-height="250">
              <v-card
                v-for="ex in pendingExperience"
                :key="ex.id"
                :class="{ 'secondary': !ex.flightPlanExperience?.completed, 'accent': ex.flightPlanExperience?.completed }"
                class="w-97 pa-0 mb-5 mr-2"
                elevation="2"
                shaped
              >
                <v-card-text class="text-h6 pa-0 pl-4">
                  <v-row class="pa-0 ma-0" height="60">
                    <v-col class="ml-4 mt-1">
                      <v-row>{{ ex.name || 'Unnamed Experience' }}</v-row>
                      <!-- Subtext Row -->
                      <v-row v-if="ex.subtext" class="text-subtitle-2 font-italic font-weight-thin">
                        <v-divider vertical class="mx-3 secondary"></v-divider>{{ ex.subtext }}
                      </v-row>
                    </v-col>
                    <!-- Small "x" button -->
                    <v-col class="text-right">
                      <v-icon @click="removePendingExperience(ex.id)">mdi-close</v-icon>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-list>
          </v-row>
        </v-card>
      </v-col>

      <!-- Past Requests -->
      <v-col cols="5">
        <v-card class="pa-4" style="height: 400px; width: 100%;">
          <v-card-title>Past Requests</v-card-title>
          <v-row no-gutters>
            <v-list class="overflow-y-auto w-100" max-height="250">
              <v-card
                v-for="ex in pastExperiences"
                :key="ex.id"
                :class="{ 'secondary': !ex.flightPlanExperience?.completed, 'accent': ex.flightPlanExperience?.completed }"
                class="w-97 pa-0 mb-5 mr-2"
                elevation="2"
                shaped
              >
                <v-card-text class="text-h6 pa-0 pl-4">
                  <v-row class="pa-0 ma-0" height="60">
                    <v-col class="ml-4 mt-1">
                      <v-row>{{ ex.name || 'Unnamed Experience' }}</v-row>
                      <!-- Subtext Row -->
                      <v-row v-if="ex.subtext" class="text-subtitle-2 font-italic font-weight-thin">
                        <v-divider vertical class="mx-3 secondary"></v-divider>{{ ex.subtext }}
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-list>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Dialog Section -->
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="bg-secondary text-center">
        <span class="headline">Add Experience</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="experienceName" label="Name" required></v-text-field>
        <v-textarea
          v-model="experienceDescription"
          label="Description"
          rows="5"
          auto-grow
          outlined 
          required
        ></v-textarea>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="red" text @click="hideDialog()">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="saveDialog()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import experienceService from "../services/experiencesServices";
import studentInfoServices from "../services/studentInfoServices";
import { onMounted, ref } from "vue";
import Utils from "../config/utils";

const user = Utils.getStore("user");

// Reactive variables
const dialog = ref(false);
const experienceName = ref("");
const experienceDescription = ref("");
const experienceType = ref("");
const pendingExperience = ref([]);
const pastExperiences = ref([]);
const studentInfoId = ref(null);

// Function to fetch student info
async function fetchStudentInfo() {
  try {
    const response = await studentInfoServices.getStudentInfoById(user.id);
    studentInfoId.value = response.data[0].id;
  } catch (error) {
    console.error("Error retrieving student info:", error);
  }
}

// Function to fetch experiences
function getExperiences() {
  experienceService
    .getAll()
    .then((response) => {

      // Filter pending experiences
      pendingExperience.value = response.data.filter(
        (exp) => exp.studentInfoId === studentInfoId.value && exp.requestedByStudent === true
      );

      // Filter past experiences
      pastExperiences.value = response.data.filter(
        (exp) => exp.studentInfoId === studentInfoId.value && exp.pastRequested === true
      );
    })
    .catch((error) => {
      console.error("Error retrieving experiences:", error);
    });
}

// Function to show the dialog
function showDialog() {
  dialog.value = true;
}

// Function to hide the dialog
function hideDialog() {
  dialog.value = false;
  experienceName.value = "";
  experienceDescription.value = "";
}

// Function to save a new experience
async function saveDialog() {
  try {
    if (!studentInfoId.value) {
      await fetchStudentInfo(); 
    }


    const experienceData = {
      name: experienceName.value,
      desc: experienceDescription.value,
      requestedByStudent: true,
      approved: false,
      subtext: "pending",
      priority: 1,
      studentInfoId: studentInfoId.value,
    };
 
    await experienceService.create(experienceData);
    hideDialog();

    getExperiences();
  } catch (error) {
    console.error("Error saving experience:", error);
  }
}

// Function to remove a pending experience
function removePendingExperience(id) {
  experienceService.delete(id).then(() => {
    pendingExperience.value = pendingExperience.value.filter((exp) => exp.id !== id);
    console.log(`Experience with ID ${id} removed successfully.`);
  });
}

onMounted(async () => {
  await fetchStudentInfo();
  getExperiences();
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>