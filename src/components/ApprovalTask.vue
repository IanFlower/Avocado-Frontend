<script setup>
import { ref, onMounted } from "vue";
import userSerices from "../services/userServices";
import roleUserServices from "../services/roleUserServices";

const search = ref(""); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(""); // Message displayed in snackbar
const snackbarColor = ref(""); // Snackbar color (success/error)
const users = ref([]); // List of users
const dialog = ref(false); // Controls the confirmation dialog visibility
const selectedUser = ref(null); // Stores the user to be approved

const headers = ref([
  { title: "Task Name", key: "tName" },
  { title: "Semester", key: "semester", sortable: false },
  { title: "Major", key: "major" },
  { title: "Student Name", key: "sName", sortable: false },
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
    .finally(() => {
      dialog.value = false; 
      selectedUser.value = null;
    });
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
        <v-btn color="red" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="green" text @click="approveUser">Approve</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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