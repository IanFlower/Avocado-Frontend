<script setup>
import { ref, onMounted } from "vue";
import roleUser from '../services/roleUserServices';
import editUser from '../components/editUser.vue';

const search = ref(''); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(''); // Message displayed in snackbar
const snackbarColor = ref(''); // Snackbar color (success/error)
const selectedButton = ref(1); // Default to 'Students'
const headers = ref([ 
  { title: 'Full Name', key: 'fullName' },
  { title: 'Role', key: 'role', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]); 
const students = ref([]); // List of students
const selectedStudent = ref(null); // Currently selected student
const editDialog = ref(false); // Controls edit dialog visibility
const roles = ref([
  { id: 1, name: 'Student' },
  { id: 2, name: 'Student Worker' },
  { id: 3, name: 'Admin' },
  { id: 4, name: 'Professor' }
]);

const roleNames = {
  1: 'Student',
  2: 'Student Worker',
  3: 'Admin',
  4: 'Professor'
};

const toggleActive = (button) => {
  switch (button) {
    case 'Students':
      selectedButton.value = 1;
      break;
    case 'Student Workers':
      selectedButton.value = 2;
      break;
    case 'Admins':
      selectedButton.value = 3;
      break;
    case 'Professors':
      selectedButton.value = 4;
      break;
    default:
      selectedButton.value = 1;
  }
  initialize();
};

const initialize = () => {
  roleUser.getUsersByRoleId(selectedButton.value)
    .then(response => {
      students.value = response.data.map(student => ({
        ...student,
        fullName: `${student.fName} ${student.lName}`,
        role: roleNames[selectedButton.value]
      }));
    })
    .catch(error => {
      console.error("Error fetching users:", error);
      students.value = [];
    });
};

const showSnackbar = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color === 'success' ? 'green' : 'red';
  snackbar.value = true;
};

const updateStudent = (item) => {
  // TODO: Implement function to update student data via API
};

const editItem = (item) => {
  selectedStudent.value = item;
  editDialog.value = true;
  showSnackbar(`Viewing: ${item.fullName}`, 'success');
};

const deleteItem = (item) => {
  // TODO: Implement function to delete student data via API
};

const goBack = () => {
  selectedStudent.value = null;
};

const saveUser = (user) => {
  // TODO: Implement function to save updated user data via API
  showSnackbar('User updated successfully', 'success');
};

onMounted(() => {
  initialize();
});
</script>

<template>
  <main>
    <!-- v-btn Section ------------------ -->
    <v-spacer></v-spacer>
    <div class="pa-12" style="padding-top:12px">
      <v-btn class="secondary" size="x-large" :class="{ 'active-button': selectedButton === 1 }" @click="toggleActive('Students')">
        Students
      </v-btn>
      <v-btn class="secondary" size="x-large" :class="{ 'active-button': selectedButton === 4 }" @click="toggleActive('Professors')">
        Professors
      </v-btn>
      <v-btn class="secondary" size="x-large" :class="{ 'active-button': selectedButton === 2 }" @click="toggleActive('Student Workers')">
        Student Workers
      </v-btn>
      <v-btn class="secondary" size="x-large" :class="{ 'active-button': selectedButton === 3 }" @click="toggleActive('Admins')">
        Admins
      </v-btn>
      <v-divider></v-divider>
      <v-spacer></v-spacer>
    </div>
    <!-- table Section ------------------ -->

    <v-container fluid class="no-padding">
      <v-row class="pa-4">
        <!-- Toolbar Section ------------------ -->
        <v-col cols="12" class="pa-4">
          <v-toolbar flat color="#F7F6FE">
            <v-toolbar-title style="margin-left: 20px;"><b>Students List</b></v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>

            <div style="width:30%">
              <!-- Search bar to filter students -->
              <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field>
            </div>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </v-col>
      </v-row>

      <v-row class="no-padding">
        <v-col cols="12" class="pa-4"> <!-- Added padding -->
          <v-card class="pa-4"> <!-- Added padding around the table -->
            <v-data-table
              :headers="headers"
              :items="students"
              :search="search"
              :sort-by="[{ key: 'fullName', order: 'asc' }]"
            >
              <!-- Actions Column with View and Delete -->
              <template v-slot:item.actions="{ item }">
                <v-icon icon="mdi-eye" color="#624DE3" class="me-2" size="small" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon size="small" color="#A30D11" @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit User Dialog -->
    <editUser
      :dialog="editDialog"
      :user="selectedStudent"
      :roles="roles"
      @update:dialog="editDialog = $event"
      @save="saveUser"
    ></editUser>

    <!-- Snackbar for user notifications -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" top right timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </main>
</template>

<style scoped>
.v-btn {
  border-radius: 40px 40px 0 0;
}
.active-button {
  background-color: #1976d2 !important;
  color: white !important;
}
</style>

