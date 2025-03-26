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
          Your Points: {{ studentInfo.currentPoints }}
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

      <template v-slot:item.image="{}">
        <span>Not Available</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn 
          :disabled="studentInfo.currentPoints < item.requiredPoints" 
          color="primary" 
          class="text-none" 
          @click="confirmPurchase(item)"
          block
        >
          {{ studentInfo.currentPoints < item.requiredPoints ? 'Not Enough Points' : 'Purchase' }}
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

const props = defineProps({
  userId: Number, 
});

const rewards = ref([]);
const searchQuery = ref("");
const dialog = ref(false);
const selectedReward = ref(null);
const studentInfo = ref({ currentPoints: 0 }); 

const headers = ref([
  { title: "Name", key: "name", align: "start", sortable: true },
  { title: "Description", key: "desc", align: "center", sortable: false },
  { title: "Purchase Count", key: "purchaseCount", align: "center", sortable: true },
  { title: "Required Points", key: "requiredPoints", align: "center", sortable: true },
  { title: "Image", key: "image", align: "center", sortable: false },
  { title: "Actions", key: "actions", align: "center", sortable: false }
]);

const fetchStudentInfo = async () => {
  try {
    if (!props.userId) return;
    const response = await studentInfoServices.getStudentInfoById(props.userId);
    console.log("Fetched student info:", response.data);
    studentInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching student info:", error);
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
  if (studentInfo.value.currentPoints < reward.requiredPoints) {
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

    
    studentInfo.value.currentPoints -= selectedReward.value.requiredPoints;

    
    const rewardIndex = rewards.value.findIndex(r => r.id === selectedReward.value.id);
    if (rewardIndex !== -1) {
      rewards.value[rewardIndex].purchaseCount += 1;
    }

    
    await studentInfoServices.updateStudentPoints(props.userId, { currentPoints: studentInfo.value.currentPoints });

    
    dialog.value = false;
    fetchStudentInfo();
  } catch (error) {
    console.error("Error updating reward:", error);
  }
};

onMounted(() => {
  fetchStudentInfo();
  fetchRewards();
});

watch(() => props.userId, (newId) => {
  if (newId) {
    fetchStudentInfo();
  }
});
</script>
