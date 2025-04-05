<script setup>
import { ref, onMounted } from "vue";
import userServices from "../services/userServices";
import experienceService from "../services/experiencesServices";
import notificationService from "../services/notification.Services";
import { no } from "vuetify/locale";

const search = ref(""); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(""); // Message displayed in snackbar
const snackbarColor = ref(""); // Snackbar color (success/error)
const users = ref([]); // List of experience requests and the names of the users
const dialog = ref(false); // Controls the confirmation dialog visibility
const selectedRequest = ref(null); // Stores the selected experience request for approval

const headers = ref([
  { title: "Request Name", key: "name", sortable: false },
  { title: "Description", key: "desc", sortable: false },
  { title: "Full Name", key: "fullName" },
  { title: "Actions", key: "actions", sortable: false },
]);

// Show a snackbar with a message and color
const showSnackbar = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color === "success" ? "green" : "red"; 
  snackbar.value = true;
  setTimeout(() => {
    snackbar.value = false;
  }, 3000);
};

// Fetch experience requests from the backend
const fetchUsers = async () => {
  try {
    const response = await userServices.getAllRequestsFromUsers();

    // Check if response.data.experienceRequests is an array
    if (Array.isArray(response.data.experienceRequests)) {
      users.value = response.data.experienceRequests.map((request) => ({
        id: request.id,
        name: request.name,
        desc: request.desc,
        studentInfoId: request.studentInfoId,
        userId: request.user?.id || null, 
        fullName: `${request.user?.fName || "N/A"} ${request.user?.lName || "N/A"}`,
        email: request.user?.email || "N/A",
        points: request.points || 0, 
      }));
    } else {
      console.error("Unexpected response format:", response.data);
      showSnackbar("Unexpected response format from server", "error"); 
    }
  } catch (error) {
    console.error("Error fetching experience requests:", error);
    showSnackbar("Failed to fetch experience requests", "error");
  }
};

// Approve the selected experience request
const approveUser = async () => {
  console.log("Approving user:", selectedRequest.value.userId); 

  try {
    dialog.value = false;

    await experienceService.update(selectedRequest.value.id, {
      approved: true,
      requestedByStudent: false,
      subtext: "approved",
      pastRequested: true,
      points: selectedRequest.value.points,
      userId: selectedRequest.value.userId,
    });

    notificationService.createNotification({
      userId: selectedRequest.value.userId,
      title: "Request Approved", 
      desc: `Your request for ${selectedRequest.value.name} has been approved.`,
      goodNews: true,
    });

    fetchUsers();
    users.value = users.value.filter((user) => user.id !== selectedRequest.value.id);

    showSnackbar("Request approved successfully", "success");
  } catch (error) {
    console.error("Error approving request:", error);
    showSnackbar("Failed to approve request", "error");
  }
};

// Deny the selected experience request
const denyUser = async () => {
  try {
    dialog.value = false;

    await experienceService.update(selectedRequest.value.id, {
      denied: true,
      requestedByStudent: false,
      pastRequested: true,
      subtext: "denied", 
    });

    notificationService.createNotification({
      userId: selectedRequest.value.userId,
      title: "Request Denied", 
      desc: `Your request for ${selectedRequest.value.name} has been Denied.`,
      goodNews: false,
    });

    fetchUsers(); 
    users.value = users.value.filter((user) => user.id !== selectedRequest.value.id); 

    showSnackbar("Request denied successfully", "success");
  } catch (error) {
    console.error("Error denying request:", error);
    showSnackbar("Failed to deny request", "error"); 
  }
};

// Open the confirmation dialog for approval
const confirmApproval = (request) => {
  selectedRequest.value = { ...request, points: request.points || 0 }; 
  dialog.value = true;
};

// Fetch data when the component is mounted
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
        item-value="id"
      >
        <template v-slot:item.actions="{ item }">
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

  <!-- Confirmation Dialog -->
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <!-- Dialog Title -->
      <v-card-title class="secondary text-center d-flex justify-space-between pt-2">
        <span class="headline">Confirm Approval</span>
          <v-icon @click="dialog = false">mdi-close</v-icon>
      </v-card-title>

      <!-- Dialog Content -->
      <v-card-text>
        <p>
          Are you sure you want to approve the request
          <strong>{{ selectedRequest?.name }}</strong> for
          <strong>{{ selectedRequest?.fullName }}</strong>?
        </p>
        <v-divider class="my-4"></v-divider>
        <p class="headline mb-2">Description:</p>
        <p class="text-body-1">{{ selectedRequest?.desc }}</p>
        <p>How many points are you giving them?</p>
        <v-text-field
          v-model="selectedRequest.points"
          label="Points"
          type="number"
          class="mt-4"
          min="0"
        ></v-text-field>
      </v-card-text>

      <!-- Dialog Actions -->
      <v-card-actions class="justify-end">
        <v-btn color="red" text @click="denyUser">Deny</v-btn>
        <v-spacer></v-spacer>
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