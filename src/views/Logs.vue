<script setup>
import { ref, onMounted } from "vue";
import logsServices from "../services/logServices"; 

const search = ref(""); 
const snackbar = ref(false); 
const snackbarMessage = ref(""); 
const snackbarColor = ref(""); 
const logs = ref([]);
const selectedLog = ref(null); 

const headers = ref([
  { title: "Log Title", key: "name", sortable: false },
  { title: "Date", key: "dateFormatted", sortable: false },
  { title: "Description", key: "desc" },
  { title: "Email", key: "email" },
  { title: "Type", key: "type" },
  { title: "Actions", key: "actions", sortable: false },
]);

// Show snackbar
const showSnackbar = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color === "success" ? "green" : "red"; 
  snackbar.value = true;
  setTimeout(() => {
    snackbar.value = false;
  }, 3000);
};
const deleteLog = async (logId) => {
    await logsServices.deleteLog(logId);
    fetchLogs(); 
};

// Fetch logs from backend
const fetchLogs = async () => {
  try {
    const response = await logsServices.getAllLogs();
    logs.value = response.data.map((log) => ({
      id: log.id,
      name: log.name,
      desc: log.desc,
      email: log.email,
      date: log.date,
      dateFormatted: new Date(log.date).toLocaleString(),
      type: log.type,
    }));

    logs.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(logs.value);
  } catch (error) {
    showSnackbar("Failed to fetch logs", "error");
  }
};

onMounted(() => {
  fetchLogs();
});
</script>

<template>
    <p class="pa-12" style="font-size: 50px;">Logs</p>
  <v-spacer></v-spacer> 
  <div>
    <div class="pa-12">
      <v-data-table
        :headers="headers"
        :items="logs"
        :items-per-page="10"
        :search="search"
        item-value="email"
      >
      <template v-slot:item.actions="{ item }">
            <v-icon
              color="#004761"
              size="large"
              class="pa-6"
              @click="deleteLog(item.id)">
              mdi-delete
            </v-icon>
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