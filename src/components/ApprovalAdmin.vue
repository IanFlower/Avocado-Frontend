<script setup>
import { ref, onMounted, computed } from "vue";
import userSerices from "../services/userServices"; 

const search = ref(''); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(''); // Message displayed in snackbar
const snackbarColor = ref(''); // Snackbar color (success/error)
const users = ref([]); // List of users

const headers = ref([ 
  { title: 'fName', key: 'fName' },
  { title: 'email', key: 'email', sortable: false },
  { title: 'aprove', key: 'approve', sortable: false },
]); 
 


const showSnackbar = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color === 'success' ? 'green' : 'red';
  snackbar.value = true;
  setTimeout(() => {
    snackbar.value = false;
  }, 3000); 
}; 

const fetchUsers = async () => {
    userSerices.getWantToBeAdminUsers()
    .then(response => {
      users.value = response.data;
    }) 


};
const approveUser = async (user) => {

};

onMounted(() => {
  // Fetch users from the database
  fetchUsers();
});

</script> 

<template>
  <v-spacer></v-spacer>
  <div>
    <div class="pa-12">
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        item-value="fName" 
      >
        <template v-slot:item.approve="{ item }">
          <v-icon color="#004761" size="large" class="pa-6">mdi-thumb-up</v-icon> 
        </template> 
      </v-data-table>
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