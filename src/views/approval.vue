<script setup>
import { ref, onMounted } from "vue";
import ApprovalAdmin from "../components/ApprovalAdmin.vue";
import ApprovalExperience from "../components/ApprovalExperience.vue";
import ApprovalTask from "../components/ApprovalTask.vue"

const search = ref(''); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(''); // Message displayed in snackbar
const snackbarColor = ref(''); // Snackbar color (success/error)
const selectedButton = ref(1); // Default to 'Students'
const newSelectedUser = ref(null); 
const selectedUser = ref(null); // Currently selected user

// Function to handle button clicks
const toggleActive = (button) => {
  selectedButton.value = button; // Update the selected button
    search.value = ''; // Clear the search query
};


// Function to show a snackbar message
const showSnackbar = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color === 'success' ? 'green' : 'red';
  snackbar.value = true;
  setTimeout(() => {
    snackbar.value = false;
  }, 3000); 
};



onMounted(() => {
});

</script>

<template>
  <p class="pa-12" style="font-size: 50px;">Approval</p>
  <!-- Button Section -->
  <v-spacer></v-spacer>
  <div>
    <div class="pa-12">
      <v-row class="pb-0">
        <v-col cols="8"> 
          <v-btn
            class="secondary"
            size="x-large"
            :class="{ 'active-button': selectedButton === 1 }"
            @click="toggleActive(1)"
          >
            Students
          </v-btn>
          <v-btn
            class="secondary"
            size="x-large"
            :class="{ 'active-button': selectedButton === 2 }"
            @click="toggleActive(2)"
          >
            Tasks
          </v-btn>
          <v-btn
            class="secondary"
            size="x-large"
            :class="{ 'active-button': selectedButton === 3 }"
            @click="toggleActive(3)"
          >
            Experiences
          </v-btn>
          <v-btn
            class="secondary"
            size="x-large"
            :class="{ 'active-button': selectedButton === 4 }"
            @click="toggleActive(4)"
          >
            Admin Approval
          </v-btn>
          <v-btn
            class="secondary"
            size="x-large"
            :class="{ 'active-button': selectedButton === 5 }"
            @click="toggleActive(5)"
          >
            Requested Approval
          </v-btn>
        </v-col> 
        <v-spacer></v-spacer>
        <v-col cols="4">
          <v-text-field 
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify" 
            variant="outlined"
            hide-details
            single-line
            class="ma-2"
          ></v-text-field>
        </v-col>
      </v-row>
      
    </div>
  </div>

  <!-- Conditional Rendering Section -->
    <div v-if="selectedButton === 1">
      <p>Students Component</p>

    </div>
    <div v-else-if="selectedButton === 2">
      <ApprovalTask/> 
    </div>
    <div v-else-if="selectedButton === 3">
      <ApprovalExperience/>
    </div>
    <div v-else-if="selectedButton === 4">
      <ApprovalAdmin/> 
    </div>
    <div v-else-if="selectedButton === 5">
      <p>Requested Approval Component</p>
    </div>
</template>

<style scoped>
.active-button {
  background-color: #004761 !important;
  color: white !important;
}

.table-container {
  padding: 0 16px; 
}
.headline {
  font-weight: bold;
}
.custom-checkbox {
  margin-bottom: 4px; 
}
.full-height {
  height: 100%;
}
.v-divider.full-height {
  height: 100%;
}
</style>