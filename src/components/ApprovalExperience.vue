<script setup>
import { ref, onMounted } from "vue";
import flightPlanExperienceService from "../services/flightPlanExperienceServices";
import studentInfoServices from "../services/studentInfoServices";
import flightPlanServices from "../services/flightPlanServices";
import userServices from "../services/userServices";
import experienceService from "../services/experiencesServices";
import experienceMajorService from "../services/experienceMajorServices";
import majorService from "../services/majors.Services";
import notificationService from "../services/notification.Services";
import userBadgesServices from "../services/userBadgesServices";
import logService from "../services/logServices";
import Utils from "../config/utils";
const user =Utils.getStore("user");

const search = ref(""); // Search query input
const snackbar = ref(false); // Controls snackbar visibility
const snackbarMessage = ref(""); // Message displayed in snackbar
const snackbarColor = ref(""); // Snackbar color (success/error)
const dialog = ref(false); // Controls the confirmation dialog visibility
const selectedExperience = ref(null); // Stores the experience to be approved
const flightPlanExperiences = ref([])
const listItems = ref([])
const comment = ref("")

const headers = ref([
  { title: "Experience Name", key: "experienceName" },
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

const approveExperience = async (approval) => {
  let notification = null
  let notificationComment = null
  if (comment.value) {
    notificationComment = ` Comment from approver: ${comment.value}`
  } else {notificationComment = ""}

  if (approval) {
    await flightPlanExperienceService.updateFlightPlanExperience(selectedExperience.value.fpExperienceId, {completed: 0, pending: 0, subtext: "", comment: comment.value})
    notification = {
      userId: selectedExperience.value.userId, 
      title: `${selectedExperience.value.experienceName} Approval`,
      desc: `Your ${selectedExperience.value.experienceName} experience has been approved!${notificationComment}`,
      goodNews: 1
    }
    await notificationService.createNotification(notification)
    let currPoints = selectedExperience.value.currPoints + selectedExperience.value.experiencePoints
    let earnedPoints = selectedExperience.value.earnedPoints + selectedExperience.value.experiencePoints
    const studentId = (await studentInfoServices.updateStudentInfo(selectedExperience.value.userId, {currentPoints: currPoints, earnedPoints: earnedPoints})).id
    userBadgesServices.checkUserBadges(studentId)

    await logService.createLog({
    name: "Experience Approved",
    desc: user.email+ " approved the experience " + selectedExperience.value.experienceName + " for the user " + selectedExperience.value.studentName,
    date: new Date().toISOString(),
    email: user.email, 
    type: "Approval" 
  })
  
  } else {
    await flightPlanExperienceService.updateFlightPlanExperience(selectedExperience.value.fpExperienceId, {completed: 0, pending: 0, subtext: "Denied", comment: comment.value})
    notification = {
      userId: selectedExperience.value.userId, 
      title: `${selectedExperience.value.experienceName} Denial`,
      desc: `Your ${selectedExperience.value.experienceName} experience has been denied.${notificationComment}`,
      goodNews: 0
    }
    await notificationService.createNotification(notification)
  }
  dialog.value = false;
  fetchExperiences()
  comment.value = null;
};

const confirmApproval = (experience) => {
  selectedExperience.value = experience; 
  dialog.value = true; 
};

async function fetchExperiences() {
  // Fetch pending experiences
  flightPlanExperiences.value = await flightPlanExperienceService.getAllPendingFlightPlanExperiences();

  // Wait for all mapped promises to resolve
  listItems.value = await Promise.all(
    flightPlanExperiences.value.data.map(async (fpExperience) => {
      // Get experience
      let experience = await experienceService.getById(fpExperience.experienceId);
      let majors = []

      let experiencePoints = experience.data.points;
      // Get majors
      let experienceMajors = await experienceMajorService.getAllForExperienceId(experience.data.id);

      
      let fullMajorList = await majorService.getAllMajors()
      if (fullMajorList.data.length == experienceMajors.data.length) {
        majors = ["All Majors"];
      } else {

        majors = await Promise.all( 
          experienceMajors.data.map( async (tm) => {
            let currMajor = fullMajorList.data.find((m) => {
                return m.id == tm.id
            })
            return currMajor.data.name
          })
        )
      }
      let allMajors = ""
      majors.forEach((major) => {allMajors += `${major} `})
      
      
      // Get student name
      let flightPlan = await flightPlanServices.getFlightPlanById(fpExperience.flightPlanId);
      let studentInfo = await studentInfoServices.getStudentInfoById(flightPlan.data.studentInfoId);
      let userId = studentInfo.data[0].userId
      let user = await userServices.getUserById(userId);
      let name = `${user.data.fName} ${user.data.lName}`;
      let currPoints = studentInfo.data[0].currentPoints;
      let earnedPoints = studentInfo.data[0].earnedPoints;

      // Construct list item
      return {
        experienceName: experience.data.name,
        semestersFromGraduation: experience.data.semestersFromGraduation,
        major: allMajors,
        studentName: name,
        fpExperienceId: fpExperience.id,
        userId: userId,
        experiencePoints: experiencePoints,
        currPoints: currPoints,
        earnedPoints: earnedPoints,
        reflection: fpExperience.reflection
      };
    })
  );
}


onMounted(() => {
  fetchExperiences();
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