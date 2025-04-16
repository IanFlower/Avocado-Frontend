<script setup>
import { ref, onMounted } from "vue";
import userSerices from "../services/userServices";
import roleUserServices from "../services/roleUserServices";
import logService from "../services/logServices";
import Utils from "../config/utils";

const search = ref(""); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(""); // Message displayed in snackbar
const snackbarColor = ref(""); // Snackbar color (success/error)
const users = ref([]); // List of users
const dialog = ref(false); // Controls the confirmation dialog visibility
const selectedUser = ref(null); // Stores the user to be approvedconst user = Utils.getStore("user");

const user = Utils.getStore("user"); 



const headers = ref([
  { title: "First Name", key: "fName" },
  { title: "Email", key: "email", sortable: false },
  { title: "Approve", key: "approve", sortable: false },
]);

const showSnackbar = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color === "success" ? "green" : "red";
  snackbar.value = true;
  setTimeout(() => {
    snackbar.value = false;
  }, 3000);
};

const fetchUsers = async () => {
  userSerices.getWantToBeAdminUsers().then((response) => {
    users.value = response.data;
  });
};

const approveUser = async () => {
  const roleId = 3;
  if (!selectedUser.value) return;
  
  roleUserServices
    .updateUserRole(selectedUser.value.id, roleId)
    .then((response) => {
      fetchUsers();
      showSnackbar("User approved successfully", "success");
    })
    .catch((error) => {
      showSnackbar("Error approving user", "error");
    })

  await logService.createLog({
    name: "Admin Approval",
    desc: user.email+ " approved the user " + selectedUser.value.email + " to be an admin",
    date: new Date().toISOString(),
    email: user.email, 
    type: "Approval"
  })
  .then((response) => {
    console.log("Log created successfully:", response.data);
    selectedUser.value = null; 
    dialog.value = false;  
  })
  
};

const confirmApproval = (user) => {
  selectedUser.value = user; 
  dialog.value = true; 
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div>
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
            <v-icon
              color="#004761"
              size="large"
              class="pa-6"
              @click="confirmApproval(item)"
            > 
              mdi-thumb-up
            </v-icon>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- Confirmation Dialog ------------------------------------------------------->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Approval</v-card-title>
        <v-card-text>
          Are you sure you want to approve
          <strong>{{ selectedUser?.fName }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          
          <v-row class="pa-0 ma-0 w-100">
            <v-col align="start"><v-btn color="red darken-1" text @click="dialog = false">Deny</v-btn></v-col>
            <v-col align="end"><v-btn color="blue darken-1" text @click="approveUser">Approve</v-btn></v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
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