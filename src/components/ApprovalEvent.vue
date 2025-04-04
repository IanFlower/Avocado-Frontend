<script setup>
import { ref, onMounted } from "vue";
import studentInfoServices from "../services/studentInfoServices";
import notificationService from "../services/notification.Services";
import eventService from "../services/eventServices";
import studentInfoEventService from "../services/studentInfoEventServices"
import papa from "papaparse"

const search = ref(""); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(""); // Message displayed in snackbar
const snackbarColor = ref(""); // Snackbar color (success/error)
const dialog = ref(false); // Controls the confirmation dialog visibility
const selectedEvent = ref(null); // Stores the event to be approved
const events = ref([])
const listItems = ref([])
const comment = ref("")
const csvFile = ref(null)
const csvData = ref(null)

const headers = ref([
  { title: "Event Name", key: "eventName" },
  { title: "Date", key: "date", sortable: false },
  { title: "Location", key: "location" },
  { title: "Approve", key: "approve", sortable: false },
]);

function showSnackbar(message, color) {
  snackbarMessage.value = message;
  snackbarColor.value = color == "success" ? "green" : "red";
  snackbar.value = true;
  setTimeout(() => {
    snackbar.value = false;
  }, 3000);
};

function handleFileChange() {
  if (csvFile.value) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      const results = papa.parse(csvText, { header: true });
      csvData.value = results.data
    };
    reader.readAsText(csvFile.value);
  }
};


function parseTime(date) {
  let time = date.match(/T(\d{2}):(\d{2}):\d{2}/);

    let hours = parseInt(time[1], 10);
    let minutes = time[2];
    let period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
}


function parseDate(date) {
  let parsedDate = new Date(date).toDateString();
  if ( date.match(/\d{4}-\d{2}-(\d{2})/) != parsedDate.match(/^(?:\S+\s+){2}(\S+)/)) {
    let weekday = parsedDate.match(/^(\S+)/)
    let month = parsedDate.match(/^(?:\S+\s+)(\S+)/)
    let day = date.match(/\d{4}-\d{2}-(\d{2})/)
    let year = parsedDate.match(/^(?:\S+\s+){3}(\S+)/)
    parsedDate = `${weekday[0]} ${month[1]} ${day[1]} ${year[1]}`
  }
  return parsedDate;
}

function closeDialog() {
  dialog.value = false;
  csvData.value = false;
  fetchEvents()
}

async function save() {
  await Promise.all(
    csvData.value.map(async (entry) => {  
      let studentInfo = await studentInfoServices.getStudentInfoBySID(entry.SID);
      
      if (studentInfo && studentInfo.data) {
        await studentInfoEventService.create({
          studentInfoId: studentInfo.data.id,
          eventId: selectedEvent.value.eventId
        });
      }
    })
  );

  closeDialog();
  showSnackbar("Attendance successfully recorded", "success");
}


const confirmApproval = (event) => {
  selectedEvent.value = event; 
  dialog.value = true; 
};

async function fetchEvents() {
  // Fetch upcoming events
  events.value = await eventService.getAllEvents();

  listItems.value = await Promise.all(
    events.value.data.map(async (event) => {
      let date = parseDate(event.startDateTime)
      // Construct list item
      return {
        eventName: event.name,
        date: date,
        location: event.location,
        eventId: event.id
      };
    })
  )
}


onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <div>
    <v-spacer></v-spacer>
    <div>
      <div class="pa-12">
        <v-data-table
          :headers="headers"
          :items="listItems"
          :search="search"
        > 
          <template v-slot:item.approve="{ item }">
            <v-icon
              color="#004761"
              size="large"
              class="pa-6"
              @click="confirmApproval(item)"
            >
              mdi-eye-outline
            </v-icon>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- Confirmation Dialog ------------------------------------------------------->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="headline"><v-row class="ma-0 pa-0 w-100"><v-col align="start">Enter Student Attendance for {{ selectedEvent?.eventName }}</v-col><v-col align="end"><v-icon @click="dialog = false">mdi-close</v-icon></v-col></v-row></v-card-title>
        <v-card-text>Please include the following column name: SID</v-card-text>
        <v-file-input
          v-model="csvFile"
          label="Select CSV File"
            accept="csv/*"
          @change="handleFileChange()"
          class="mx-4"
        ></v-file-input>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row class="pa-0 ma-0 w-100">
            <v-col align="start"><v-btn color="red darken-1" text @click="closeDialog()">Cancel</v-btn></v-col>
            <v-col align="end"><v-btn color="blue darken-1" text @click="save()">Save</v-btn></v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar :color=snackbarColor v-model=snackbar>{{ snackbarMessage }}</v-snackbar>
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