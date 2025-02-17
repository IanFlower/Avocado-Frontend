<script setup>
import { ref, onMounted, computed } from "vue";
import roleUser from '../services/roleUserServices';
import Utils from '../config/utils';
import EditUserDialog from '../components/EditUserDialog.vue';

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
  setTimeout(() => {
    snackbar.value = false;
  }, 3000); 
};

const updateStudent = (item) => {
  // TODO: Implement function to update student data via API
};

const editItem = (item) => {
  selectedStudent.value = item;
  editDialog.value = true;
  showSnackbar(`Viewing: ${item.fullName}`, 'success');
};

const goBack = () => {
  selectedStudent.value = null;
};

const saveUser = (user) => {
  showSnackbar('User updated successfully', 'success');
};

onMounted(() => {
  initialize();
});

const dialogModel = computed({
  get: () => editDialog.value,
  set: (value) => editDialog.value = value
});

const closeDialog = () => {
  editDialog.value = false;
};

const saveDialog = (updatedPermission) => {
  saveUser(selectedStudent.value);
  closeDialog();
};
</script>

<template>
  <p class="pa-12" style="font-size: 50px;">Manage User Permissions</p>
  <!-- v-btn Section -------------------------------------------- -->
  <v-spacer></v-spacer>
  <div>
    <div class="pa-12">
      <v-row>
        <v-col cols="6">
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
        </v-col>
        <v-col cols="6">
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
      <v-data-table
        :headers="headers"
        :items="students"
        :search="search"
        item-value="fullName"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="#004761" size="large" class="pa-6" @click="editItem(item)">mdi-shield</v-icon> 
          <v-icon color="#004761" size="large" @click="deleteItem(item)">mdi-pencil-box-outline</v-icon>  
        </template>
      </v-data-table>

      <!-- Edit User Dialog -->
      <EditUserDialog
        :dialog="dialogModel"
        :selectedStudent="selectedStudent"
        @update:dialog="editDialog = $event" 
        @save="saveDialog"
      />
    </div>
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