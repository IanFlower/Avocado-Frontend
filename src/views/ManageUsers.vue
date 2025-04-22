<script setup>
import { ref, onMounted, computed } from "vue";
import roleUser from '../services/roleUserServices';
import Utils from '../config/utils';
import EditUserDialog from '../components/EditUserDialog.vue';
import roleServices from '../services/roleServices';  
import logService from '../services/logServices';

const search = ref(''); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(''); // Message displayed in snackbar
const snackbarColor = ref(''); // Snackbar color (success/error)
const selectedButton = ref(1); // Default to 'Students'
const newEditDialog = ref(false); // Controls new edit dialog visibility
const newSelectedUser = ref(null); 
const availableRoles = ref(['Student', 'Student Worker', 'Admin', 'Professor']); 
const headers = ref([ 
  { title: 'Full Name', key: 'fullName' },
  { title: 'Role', key: 'role', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]); 
const users = ref([]); // List of users  
const selectedUser = ref(null); // Currently selected user
const editDialog = ref(false); // Controls edit dialog visibility
const user = Utils.getStore('user'); // Get the current user from local storage

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
      users.value = response.data.map(user => ({
        ...user,
        fullName: `${user.fName} ${user.lName}`,
        role: roleNames[selectedButton.value]
      }));
    })
    .catch(error => {
      users.value = [];
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

const updateUser = (item) => {
  // TODO: Implement function to update user data via API
};

const editItem = (item) => {
  selectedUser.value = item;
  editDialog.value = true;
};

const newEditItem = async (item) => {
  newSelectedUser.value = item;
  await fetchAvailableRoles();
  newEditDialog.value = true; 
};

const goBack = () => {
  selectedUser.value = null;
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

const closeNewDialog = () => {
  newEditDialog.value = false;
};

const saveDialog =async (updatedPermission) => {
  saveUser(selectedUser.value);
  closeDialog();
  await logService.createLog({
        name: "Added Permissions",
        desc: user.email+ " added permissions for " + selectedUser.value.fullName,
        date: new Date().toISOString(),
        email: user.email, 
        type: "Security"
 })

};

const saveNewDialog = async () => {
  
    const roleId = roles.value.find(role => role.name === newSelectedUser.value.role)?.id;
    if (roleId !== undefined) {
      await roleUser.updateUserRole(newSelectedUser.value.id, roleId); 
      showSnackbar('User updated successfully', 'success');
      closeNewDialog();
    } else {
      showSnackbar('Invalid role selected', 'error');

    }
    await logService.createLog({
            name: "Role Change",
            desc: user.email+ " changed the role of " + newSelectedUser.value.fullName + " to " + newSelectedUser.value.role,
            date: new Date().toISOString(),
            email: user.email, 
            type: "Security"
        }) 

  
};

const fetchAvailableRoles = async () => {
//need to implement this function 
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
        :items="users"
        :search="search"
        item-value="fullName"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="#004761" size="large" class="pa-6" @click="editItem(item)">mdi-shield</v-icon> 
          <v-icon color="#004761" size="large" @click="newEditItem(item)">mdi-pencil-box-outline</v-icon>  
        </template>
      </v-data-table>

      <!-- Edit User permissions Dialog -->
      <EditUserDialog
        :dialog="dialogModel"
        :selectedUser="selectedUser"
        @update:dialog="editDialog = $event" 
        @save="saveDialog"
      />

      <!-- New Edit User Dialog -->
      <v-dialog v-model="newEditDialog" max-width="600px">
        <v-card>
          <v-card-title class="bg-secondary text-center sticky-title">
                <span>Edit User - {{ newSelectedUser?.fullName }}</span>
            </v-card-title> 
          <v-card-text>
            <!-- Add form fields here to edit user details -->
            <v-select v-model="newSelectedUser.role" :items="availableRoles" item-text="name" item-value="id" label="Role"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeNewDialog">Cancel</v-btn> 
            <v-btn color="blue darken-1" text @click="saveNewDialog">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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