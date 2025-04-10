<script setup>
import { ref, onMounted,watch  } from "vue";
import userServices from "../services/userServices";

import flightPlanTaskService from "../services/flightPlanTaskServices";
import studentInfoServices from "../services/studentInfoServices";
import flightPlanServices from "../services/flightPlanServices";
import taskService from "../services/tasksServices";
import taskMajorService from "../services/taskMajorServices";
import majorService from "../services/majors.Services";
import notificationService from "../services/notification.Services";
import userBadgesServices from "../services/userBadgesServices";
import documentService from "../services/documentService";
import PDF from "pdf-vue3";

const search = ref(""); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(""); // Message displayed in snackbar
const snackbarColor = ref(""); // Snackbar color (success/error)
const dialog = ref(false); // Controls the confirmation dialog visibility
const selectedTask = ref(null); // Stores the task to be approved
const flightPlanTasks = ref([])
const listItems = ref([])
const comment = ref("")
const file = ref(null); 
const document = ref(false);


const headers = ref([
  { title: "Task Name", key: "taskName" },
  { title: "Semesters From Graduation", key: "semestersFromGraduation", sortable: false },
  { title: "Major", key: "major" },
  { title: "Student Name", key: "studentName", sortable: false },
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

const approveTask = async (approval) => {
  let notification = null
  let notificationComment = null
  if (comment.value) {
    notificationComment = ` Comment from approver: ${comment.value}`
  } else {notificationComment = ""}

  if (approval) {
    await flightPlanTaskService.updateFlightPlanTask(selectedTask.value.fpTaskId, {completed: 1, pending: 0, subtext: "", comment: comment.value})
    // Add notification
    notification = {
      userId: selectedTask.value.userId, 
      title: `${selectedTask.value.taskName} Approval`,
      desc: `Your ${selectedTask.value.taskName} task has been approved!${notificationComment}`,
      goodNews: 1
    }
    await notificationService.createNotification(notification)
    // Update student points
    let currPoints = selectedTask.value.currPoints + selectedTask.value.taskPoints
    let earnedPoints = selectedTask.value.earnedPoints + selectedTask.value.taskPoints
    const studentId = (await studentInfoServices.updateStudentInfo(selectedTask.value.userId, {currentPoints: currPoints, earnedPoints: earnedPoints})).id
    // Check if user earned badges
    userBadgesServices.checkUserBadges(studentId)
  } else {
    await flightPlanTaskService.updateFlightPlanTask(selectedTask.value.fpTaskId, {completed: 0, pending: 0, subtext: "Denied", comment: comment.value})
    notification = {
      userId: selectedTask.value.userId, 
      title: `${selectedTask.value.taskName} Denial`,
      desc: `Your ${selectedTask.value.taskName} task has been denied.${notificationComment}`,
      goodNews: 0
    }
    await notificationService.createNotification(notification)
  }
  dialog.value = false;
  fetchTasks()
  comment.value = null;
};

const confirmApproval = (task) => {
  selectedTask.value = task; 
  dialog.value = true; 
};

async function fetchTasks() {
  // Fetch pending tasks
  flightPlanTasks.value = await flightPlanTaskService.getAllPendingFlightPlanTasks();
  // Wait for all mapped promises to resolve
  listItems.value = await Promise.all(
    flightPlanTasks.value.data.map(async (fpTask) => {
      // Get task
      let task = await taskService.getById(fpTask.taskId);

      let taskPoints = task.data.points;
      // Get majors
      let taskMajors = await taskMajorService.getAllForTaskId(task.data.id);

      let majors = await Promise.all( 
        taskMajors.data.map( async (tm) => {
          let currMajor = await majorService.getMajorById(tm.majorId)
          return currMajor.data.name
        })
      )

      let allMajors = ""
      majors.forEach((major) => {allMajors += `${major} `})
      
      
      // Get student name
      let flightPlan = await flightPlanServices.getFlightPlanById(fpTask.flightPlanId);
      let studentInfo = await studentInfoServices.getStudentInfoById(flightPlan.data.studentInfoId);
      let userId = studentInfo.data[0].userId
      let user = await userServices.getUserById(userId);
      let name = `${user.data.fName} ${user.data.lName}`;
      let currPoints = studentInfo.data[0].currentPoints;
      let earnedPoints = studentInfo.data[0].earnedPoints;

      // Construct list item
      return {
        taskName: task.data.name,
        semestersFromGraduation: task.data.semestersFromGraduation,
        major: allMajors,
        studentName: name,
        fpTaskId: fpTask.id,
        userId: userId,
        taskPoints: taskPoints,
        currPoints: currPoints,
        earnedPoints: earnedPoints
      };
    })
  );
}
function viewDocument() {
  const flightPlanId = selectedTask.value.fpTaskId;

  documentService.getDocumentByFlightPlanTaskId(flightPlanId)
    .then((res) => {
      file.value = `data:application/pdf;base64,${res.data}`;
      document.value = true;
    })
    .catch((error) => {
      console.error("Error fetching document:", error);
    });

}
watch(dialog, (val) => {
  if (val && selectedTask.value) {
    viewDocument();
  }
});

onMounted(() => {
  fetchTasks();
  
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
    <v-dialog v-model="dialog" max-width="900">
      <v-card>
        <v-card-title class="headline"><v-row class="ma-0 pa-0 w-100"><v-col align="start">Confirm Approval</v-col><v-col align="end"><v-icon @click="dialog = false">mdi-close</v-icon></v-col></v-row></v-card-title>
        <v-card-text>
          Are you sure you want to approve
          <strong>{{ selectedTask?.taskName }}</strong> for 
          <strong>{{ selectedTask?.studentName }}</strong>?
        </v-card-text>
        <v-card-text>

            <PDF v-if="document" :src="file" style="height: 600px;" />


        </v-card-text>
        <v-textarea class="px-3" label="Enter a comment if desired:" v-model="comment"></v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row class="pa-0 ma-0 w-100">
            <v-col align="start"><v-btn color="red darken-1" text @click="approveTask(false)">Deny</v-btn></v-col>
            <v-col align="end"><v-btn color="blue darken-1" text @click="approveTask(true)">Approve</v-btn></v-col>
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