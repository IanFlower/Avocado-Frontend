<template>
  <p class="pa-12 text-h3 font-weight-bold">Purchase Reward</p>

  <v-container>
    <v-row>
      <v-col cols="6">
        <v-text-field 
          v-model="searchQuery" 
          label="Search" 
          prepend-inner-icon="mdi-magnify" 
          variant="outlined"
          hide-details 
          single-line 
          class="ma-2"
        />
      </v-col>
      <v-col cols="6" class="d-flex justify-end">
        <v-chip color="primary" class="ma-2">
          Your Points: {{ studentPoints }}
        </v-chip>
      </v-col>
    </v-row>

    <v-data-table 
      :headers="headers" 
      :items="rewards" 
      :search="searchQuery" 
      item-value="name" 
      class="elevation-2"
    >
      <template v-slot:item.name="{ item }">
        <span>{{ item.name }}</span>
      </template>

      <template v-slot:item.desc="{ item }">
        <span>{{ item.desc }}</span>
      </template>

      <template v-slot:item.purchaseCount="{ item }">
        <span>{{ item.purchaseCount }}</span>
      </template>

      <template v-slot:item.requiredPoints="{ item }">
        <span>{{ item.requiredPoints }}</span>
      </template>

      <template v-slot:item.image="{ }">
        <span>Not Available</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn 
          :disabled="studentPoints < item.requiredPoints" 
          color="primary" 
          class="text-none" 
          @click="confirmPurchase(item)"
          block
        >
          {{ studentPoints < item.requiredPoints ? 'Not Enough Points' : 'Purchase' }}
        </v-btn>
      </template>
    </v-data-table>
  </v-container>

  <!-- Confirmation Dialog -->
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5">Confirm Purchase</v-card-title>
      <v-card-text>
        Would you like to purchase <strong>{{ selectedReward?.name }}</strong>?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" variant="text" @click="dialog = false">No</v-btn>
        <v-btn color="success" variant="text" @click="purchaseReward">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import rewardServices from "../services/rewardServices.js";
import studentInfoServices from "../services/studentInfoServices.js";

// Props
const props = defineProps({
  userId: Number, // Expecting userId as a prop
});

const rewards = ref([]);
const searchQuery = ref("");
const dialog = ref(false);
const selectedReward = ref(null);
const studentPoints = ref(0); // Store student's current points

const headers = ref([
  { title: "Name", key: "name", align: "start", sortable: true },
  { title: "Description", key: "desc", align: "center", sortable: false },
  { title: "Purchase Count", key: "purchaseCount", align: "center", sortable: true },
  { title: "Required Points", key: "requiredPoints", align: "center", sortable: true },
  { title: "Image", key: "image", align: "center", sortable: false },
  { title: "Actions", key: "actions", align: "center", sortable: false }
]);

const fetchStudentPoints = async () => {
  try {
    if (!props.userId) return;

    const studentResponse = await studentInfoServices.getStudentInfoById(props.userId);
    studentPoints.value = studentResponse.data.currentPoints;
  } catch (error) {
    console.error("Error fetching student points:", error);
  }
};

const fetchRewards = async () => {
  try {
    const response = await rewardServices.getAllRewards();
    rewards.value = response.data.map(reward => ({
      id: reward.id,
      name: reward.name,
      desc: reward.desc,
      purchaseCount: reward.purchaseCount,
      requiredPoints: reward.requiredPoints
    }));
  } catch (error) {
    console.error("Error fetching rewards:", error);
    rewards.value = [];
  }
};

const confirmPurchase = (reward) => {
  if (studentPoints.value < reward.requiredPoints) {
    console.warn("Not enough points to purchase this reward.");
    return;
  }
  selectedReward.value = reward;
  dialog.value = true;
};

const purchaseReward = async () => {
  if (!selectedReward.value || !selectedReward.value.id) {
    console.error("Error: selectedReward is undefined or missing an ID", selectedReward.value);
    return;
  }

  try {
    console.log("Attempting to purchase reward:", selectedReward.value);

    // Deduct points from the student
    studentPoints.value -= selectedReward.value.requiredPoints;

    // Update UI
    const rewardIndex = rewards.value.findIndex(r => r.id === selectedReward.value.id);
    if (rewardIndex !== -1) {
      rewards.value[rewardIndex].purchaseCount += 1;
    }

    // Close dialog
    dialog.value = false;
  } catch (error) {
    console.error("Error updating reward:", error);
  }
};

onMounted(() => {
  fetchStudentPoints();
  fetchRewards();
});


watch(() => props.userId, (newId) => {
  if (newId) {
    fetchStudentPoints();
  }
});
</script>
