<script setup>
import { ref, onMounted, computed } from "vue";
import roleUser from '../services/roleUserServices';


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
const users = ref([]); // List of users  



const showSnackbar = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color === 'success' ? 'green' : 'red';
  snackbar.value = true;
  setTimeout(() => {
    snackbar.value = false;
  }, 3000); 
};




const saveUser = (user) => {
  showSnackbar('User updated successfully', 'success');
};

onMounted(() => {

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
        item-value="fullName"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="#004761" size="large" class="pa-6" @click="editItem(item)">mdi-shield</v-icon> 
          <v-icon color="#004761" size="large" @click="newEditItem(item)">mdi-pencil-box-outline</v-icon>  
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