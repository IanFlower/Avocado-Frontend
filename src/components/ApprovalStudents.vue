<script setup>
import { ref, onMounted,watch } from "vue";
import userServices from "../services/userServices";
import roleUserServices from "../services/roleUserServices";
import logService from "../services/logServices";
import Utils from "../config/utils";
import experienceService from "../services/experiencesServices";
import roleUser from "../services/roleUserServices";
import flightPlanTaskService from "../services/flightPlanTaskServices";
import flightPlanExperienceService from "../services/flightPlanExperienceServices";
import flightPlanServices from "../services/flightPlanServices";
import studentInfoServices from "../services/studentInfoServices";
import taskMajorService from "../services/taskMajorServices";
import majorService from "../services/majors.Services";
import experienceMajorService from "../services/experienceMajorServices";
import notificationService from "../services/notification.Services";
import taskService from "../services/tasksServices"; 
import documentService from "../services/documentService";
import PDF from "pdf-vue3";

const search = ref("");
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");

const users = ref([]); 

const taskDialog = ref(false);
const selectedTask = ref(null);
const file = ref(null);
const document = ref(false);

const dialog = ref(false);
const selectedUser = ref(null);
const selectedExperience = ref(null);

const requestDialog = ref(false);
const selectedRequest = ref(null);
const adminDialog = ref(false);


const flightPlanExperiences = ref([]);
const listItems = ref([]);
const comment = ref("");
const flightPlanTasks = ref([]);
const experienceDialog = ref(false);
const reflection = ref("");

const user = Utils.getStore("user");

const headers = ref([
  { title: "First Name", key: "fName" },
  { title: "Email", key: "email", sortable: false },
  { title: "Approval Type", key: "type"},
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

async function fetchExperiences() {
  flightPlanExperiences.value = await flightPlanExperienceService.getAllPendingFlightPlanExperiences();

  const items = await Promise.all(
    flightPlanExperiences.value.data.map(async (fpExperience) => {
      let experience = await experienceService.getById(fpExperience.experienceId);
      let experiencePoints = experience.data.points;
      let experienceMajors = await experienceMajorService.getAllForExperienceId(experience.data.id);
      let majors = await Promise.all(
        experienceMajors.data.map(async (tm) => {
          let currMajor = await majorService.getMajorById(tm.majorId);
          return currMajor.data.name;
        })
      );

      let allMajors = majors.join(" ");
      let flightPlan = await flightPlanServices.getFlightPlanById(fpExperience.flightPlanId);
      let studentInfo = await studentInfoServices.getStudentInfoById(flightPlan.data.studentInfoId);
      let userId = studentInfo.data[0].userId;
      let user = await userServices.getUserById(userId);
      let name = `${user.data.fName} ${user.data.lName}`;
      let currPoints = studentInfo.data[0].currentPoints;
      let earnedPoints = studentInfo.data[0].earnedPoints;

      return {
        experienceName: experience.data.name,
        semestersFromGraduation: experience.data.semestersFromGraduation,
        major: allMajors,
        studentName: name,
        fname: user.data.fName,
        email: user.data.email,
        fpExperienceId: fpExperience.id,
        userId: userId,
        experiencePoints: experiencePoints,
        currPoints: currPoints,
        earnedPoints: earnedPoints,
        reflection: fpExperience.reflection,
        fName: name,
        type: "Experience",

      };
    })
  );

  listItems.value.push(...items); 
  users.value.push(...items);
}




const fetchWantToBeAdmins = async () => {
  try {
    const response = await userServices.getWantToBeAdminUsers();
    if (Array.isArray(response.data)) {
      const mapped = response.data.map((request) => ({
        id: request.id,
        fullName: `${request.fName || "N/A"} ${request.lName || "N/A"}`, 
        email: request.email || "N/A",
        fName: request.fName,
        type: "Admin",

      }));
      users.value.push(...mapped); 
    } else {
      showSnackbar("Unexpected response format from server", "error");
    }
  } catch (error) {
    console.error("Error fetching want-to-be-admins:", error);
    showSnackbar("Failed to fetch admin requests", "error");
  }
};

const fetchRequestsUsers = async () => {
  try {
    const response = await userServices.getAllRequestsFromUsers();
    if (Array.isArray(response.data.experienceRequests)) {
      const mapped = response.data.experienceRequests.map((request) => ({
        id: request.id,
        name: request.name,
        desc: request.desc,
        studentInfoId: request.studentInfoId,
        userId: request.user?.id || null,
        fullName: `${request.user?.fName || "N/A"} ${request.user?.lName || "N/A"}`,
        email: request.user?.email || "N/A",
        points: request.points || 0,
        fName: request.user?.fName || "N/A",
        type: "Request Experiences",

      }));
      users.value.push(...mapped);
    } else {
      showSnackbar("Unexpected response format from server", "error");
    }
  } catch (error) {
    console.error("Error fetching user requests:", error);
    showSnackbar("Failed to fetch experience requests", "error");
  }
};

async function fetchTasks() {
  flightPlanTasks.value = await flightPlanTaskService.getAllPendingFlightPlanTasks();
  const items = await Promise.all(
    flightPlanTasks.value.data.map(async (fpTask) => {
      let task = await taskService.getById(fpTask.taskId);
      let taskPoints = task.data.points;
      let taskMajors = await taskMajorService.getAllForTaskId(task.data.id);
      let majors = await Promise.all(
        taskMajors.data.map(async (tm) => {
          let currMajor = await majorService.getMajorById(tm.majorId);
          return currMajor.data.name;
        })
      );

      let allMajors = majors.join(" ");
      let flightPlan = await flightPlanServices.getFlightPlanById(fpTask.flightPlanId);
      let studentInfo = await studentInfoServices.getStudentInfoById(flightPlan.data.studentInfoId);
      let userId = studentInfo.data[0].userId;
      let user = await userServices.getUserById(userId);
      let name = `${user.data.fName} ${user.data.lName}`;
      let currPoints = studentInfo.data[0].currentPoints;
      let earnedPoints = studentInfo.data[0].earnedPoints;

      return {
        taskName: task.data.name,
        semestersFromGraduation: task.data.semestersFromGraduation,
        studentName: name,
        major: allMajors,
        fpTaskId: fpTask.id,
        userId: userId,
        taskPoints: taskPoints,
        currPoints: currPoints,
        earnedPoints: earnedPoints,
        fName: name,
        email: user.data.email,
        type: "tasks",

      };
    })
  );

  listItems.value.push(...items); 
  users.value.push(...items);
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
watch(taskDialog, (val) => {
  if (val && selectedTask.value) {
    console.log("Selected Task:", selectedTask.value);
    viewDocument();
  }
});



const confirmApproval = (user) => {
  selectedUser.value = user;

  if(user.type === "Request Experiences") {
    requestDialog.value = true;
    selectedRequest.value = user;

  } else if(user.type === "Experience") {
    selectedExperience.value = user
    experienceDialog.value = true;
  } else if(user.type === "Admin") {
    selectedUser.value = user;
    adminDialog.value = true;
  } else if(user.type === "tasks") {
    selectedTask.value =listItems.value.find((task) => task.fpTaskId === user.fpTaskId);
    taskDialog.value = true;
  } else {
    adminDialog.value = true;
  }




};



const approveAdmin = async (approved) => {
    if (approved){
            try {
            adminDialog.value = false;

            await experienceService.update(selectedRequest.value.id, {
                approved: true,
                requestedByStudent: false,
                subtext: "approved",
                points: selectedRequest.value.points,
                userId: selectedRequest.value.userId,
                pastRequested: true,
            });

            notificationService.createNotification({
                userId: selectedRequest.value.userId,
                title: "Request Approved", 
                desc: `Your request for ${selectedRequest.value.name} has been approved.`,
                goodNews: true,

            });

            fetchUsers();
            users.value = users.value.filter((user) => user.id !== selectedRequest.value.id);

            await logService.createLog({
                name: "Requested Experience Approved",
                desc: `${user.email} approved the requested experience ${selectedRequest.value.name} for the user ${selectedRequest.value.fullName}`,
                date: new Date().toISOString(), 
                email: user.email, 
                type: "Approval" 
            }) 

            showSnackbar("Request approved successfully", "success");
            } catch (error) {
            console.error("Error approving request:", error);
            showSnackbar("Failed to approve request", "error");
            }
    } else{
        try {
            adminDialog.value = false;

            await experienceService.update(selectedRequest.value.id, {
            denied: true,
            requestedByStudent: false,
            subtext: "denied", 
            });

            notificationService.createNotification({
            userId: selectedRequest.value.userId,
            title: "Request Denied", 
            desc: `Your request for ${selectedRequest.value.name} has been Denied.`,
            goodNews: false,
            pastRequested: true,
            });

            fetchUsers(); 
            users.value = users.value.filter((user) => user.id !== selectedRequest.value.id);

            showSnackbar("Request denied successfully", "success");
        } catch (error) {
            console.error("Error denying request:", error);
            showSnackbar("Failed to deny request", "error");
        }

    }

};

const approveExperience = async (approved) => {
    if(approved){
        try {
            experienceDialog.value = false;

            await flightPlanExperienceService.updateFlightPlanExperience(selectedExperience.value.fpExperienceId, {completed: 1, pending: 0, subtext: "", comment: comment.value})
            // Add notification
            let notification = {
                userId: selectedExperience.value.userId, 
                title: `${selectedExperience.value.experienceName} Approval`,
                desc: `Your ${selectedExperience.value.experienceName} experience has been approved!`,
                goodNews: 1
            }
            await notificationService.createNotification(notification)
            // Update student points
            let currPoints = selectedExperience.value.currPoints + selectedExperience.value.experiencePoints
            let earnedPoints = selectedExperience.value.earnedPoints + selectedExperience.value.experiencePoints
            const studentId = (await studentInfoServices.updateStudentInfo(selectedExperience.value.userId, {currentPoints: currPoints, earnedPoints: earnedPoints})).id
            // Check if user earned badges
            userBadgesServices.checkUserBadges(studentId)

            await logService.createLog({
                name: "Task Approved",
                desc: `${user.email} approved the task ${selectedTask.value.taskName} for the user`,
                date: new Date().toISOString(),
                email: user.email, 
                type: "Approval" 
            }) 

        } catch (error) {
            console.error("Error approving request:", error);
        }
    } else{
        try {
            experienceDialog.value = false;

            await flightPlanExperienceService.updateFlightPlanExperience(selectedExperience.value.fpExperienceId, {completed: 0, pending: 0, subtext: "Denied", comment: comment.value})
            
            let notification = {
                userId: selectedExperience.value.userId, 
                title: `${selectedExperience.value.experienceName} Denial`,
                desc: `Your ${selectedExperience.value.experienceName} experience has been denied.`,
                goodNews: 0
            }
            await notificationService.createNotification(notification)
        } catch (error) {
            console.error("Error denying request:", error);
        }
    }
    experienceDialog.value = false;
    fetchExperiences()
    comment.value = null;
};

const approveTask = async (approved) => {
  if (approved) {
    try {
      taskDialog.value = false;

      await flightPlanTaskService.updateFlightPlanTask(selectedTask.value.fpTaskId, { completed: 1, pending: 0, subtext: "", comment: comment.value });
      // Add notification
      let notification = {
        userId: selectedTask.value.userId,
        title: `${selectedTask.value.taskName} Approval`,
        desc: `Your ${selectedTask.value.taskName} task has been approved!`,
        goodNews: 1
      };
      await notificationService.createNotification(notification);
      // Update student points
      let currPoints = selectedTask.value.currPoints + selectedTask.value.taskPoints;
      let earnedPoints = selectedTask.value.earnedPoints + selectedTask.value.taskPoints;
      const studentId = (await studentInfoServices.updateStudentInfo(selectedTask.value.userId, { currentPoints: currPoints, earnedPoints: earnedPoints })).id;
      // Check if user earned badges
      userBadgesServices.checkUserBadges(studentId);

      await logService.createLog({
        name: "Task Approved",
        desc: `${user.email} approved the task ${selectedTask.value.taskName} for the user`,
        date: new Date().toISOString(),
        email: user.email,
        type: "Approval"
      });

    } catch (error) {
      console.error("Error approving request:", error);
    }
  } else {
    try {
      taskDialog.value = false;

      await flightPlanTaskService.updateFlightPlanTask(selectedTask.value.fpTaskId, { completed: 0, pending: 0, subtext: "Denied", comment: comment.value });

      let notification = {
        userId: selectedTask.value.userId,
        title: `${selectedTask.value.taskName} Denial`,
        desc: `Your ${selectedTask.value.taskName} task has been denied.`,
        goodNews: 0
      };
      await notificationService.createNotification(notification);
    } catch (error) {
      console.error("Error denying request:", error);
    }
  }
  taskDialog.value = false;
  fetchTasks()
  comment.value = null; 
};

const approveTask = async (approved) => {

};
const approveRequest = async (approved) => {

};







const props = defineProps({
  selectedUser: Object,
  search: String
});



const closeDialog = () => {
  experienceDialog.value = false;
  taskDialog.value = false;
  requestDialog.value = false;
  adminDialog.value = false;
  dialog.value = false;

    selectedExperience.value = null;
    selectedTask.value = null;
    selectedRequest.value = null;
    selectedUser.value = null;
    comment.value = null;
};





onMounted(() => {
  fetchExperiences();
  fetchTasks();
  fetchRequestsUsers();
  fetchWantToBeAdmins();
});
</script>

<template>
  <div class="pa-10">


    <v-spacer></v-spacer>
    <div class="pa-12">
      <v-data-table
        :headers="headers"
        :items="users"
        :search="props.search"
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

    <v-dialog v-model="experienceDialog" max-width="600">
      <v-card>
        <v-card-title class="headline"><v-row class="ma-0 pa-0 w-100"><v-col align="start">Confirm Approval</v-col><v-col align="end"><v-icon @click="dialog = false">mdi-close</v-icon></v-col></v-row></v-card-title>
        <v-card-text>
          Are you sure you want to approve
          <strong>{{ selectedExperience?.experienceName }}</strong> for 
          <strong>{{ selectedExperience?.studentName }}</strong>?
        </v-card-text>
        <v-card-text><v-container max-height=200px class="overflow-y-auto w-100"><v-row max-height=100px class="overflow-y-auto w-100"><v-col class="overflow-y-auto"><strong>Student's Reflection: </strong> {{ selectedExperience.reflection }}</v-col></v-row></v-container></v-card-text>
        <v-textarea class="px-3" label="Enter a comment if desired:" v-model="comment"></v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row class="pa-0 ma-0 w-100">
            <v-col align="start"><v-btn color="red darken-1" text @click="approveExperience(false)">Deny</v-btn></v-col>
            <v-col align="end"><v-btn color="blue darken-1" text @click="approveExperience(true)">Approve</v-btn></v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="taskDialog" max-width="900">
      <v-card>
        <v-card-title class="headline"><v-row class="ma-0 pa-0 w-100"><v-col align="start">Confirm Approval</v-col><v-col align="end">
            <v-icon @click="closeDialog()">mdi-close</v-icon></v-col></v-row></v-card-title>
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

    <v-dialog v-model="adminDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Admin Approval</v-card-title>
        <v-card-text>
          Are you sure you want to approve
          <strong>{{ selectedUser?.fName }}</strong> to be an admin?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          
          <v-row class="pa-0 ma-0 w-100">
            <v-col align="start"><v-btn color="red darken-1" text @click="approveAdmin(false)">Deny</v-btn></v-col>
            <v-col align="end"><v-btn color="blue darken-1" text @click="approveAdmin(true)">Approve</v-btn></v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="requestDialog" max-width="500">
    <v-card>
      <!-- Dialog Title -->
      <v-card-title class="secondary text-center d-flex justify-space-between pt-2">
        <span class="headline">Confirm Approval</span>
          <v-icon @click="closeDialog()" >mdi-close</v-icon>
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
        <v-btn color="red" text @click="approveRequest(false)">Deny</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="green" text @click="approveRequest(true)">Approve</v-btn>
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
