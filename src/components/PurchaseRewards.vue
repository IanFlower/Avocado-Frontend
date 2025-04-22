<template>
  <v-container>
    <!-- Search Bar -->
    <v-row justify="center">
      <v-col cols="8">
        <v-text-field v-model="searchQuery" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
          hide-details single-line class="ma-2" />
      </v-col>
    </v-row>

    <!-- Rewards List -->
    <v-row v-for="reward in filteredRewards" :key="reward.id" class="mb-3 pa-2 rounded-lg justify-center">
      <v-col cols="2">
        <div style="font-size: 20px; font-weight: bold; color: #004761;">
          {{ reward.name }}
        </div>
      </v-col>
      <v-col cols="2">
        Purchase Count: {{ reward.purchaseCount }}
      </v-col>
      <v-col cols="2">
        Required Points: {{ reward.requiredPoints }}
      </v-col>
      <v-col cols="2">
        Your Points:
        <span class="font-weight-bold">
          {{ studentInfo.length > 0 ? studentInfo[0].currentPoints : 'Loading...' }}
        </span>
      </v-col>
      <v-col cols="3">
        <v-btn class="tertiary-button" :disabled="!hasEnoughPoints(reward.requiredPoints)" block
          @click="confirmPurchase(reward)">
          {{ hasEnoughPoints(reward.requiredPoints) ? 'Purchase' : 'Not Enough Points' }}
        </v-btn>
      </v-col>
    </v-row>
    
<!-- Confirm Purchase Dialog -->
<v-dialog v-model="dialog" max-width="400">
  <v-card>
    <v-card-title class="text-h5 justify-center">Confirm Purchase</v-card-title>
    <v-card-text>
      Would you like to purchase <strong>{{ selectedReward?.name }}</strong>?
    </v-card-text>
    <v-card-actions>
      <v-col align="Start">
        <v-btn color="red darken-1" variant="text" @click="dialog = false">No</v-btn>
      </v-col>

      <v-col align="End">
        <v-btn color="blue darken-1" variant="text" @click="purchaseReward">Yes</v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import rewardServices from "../services/rewardServices.js";
import studentInfoServices from "../services/studentInfoServices.js";
import studentPurchaseService from "../services/studentPurchaseServices.js";
import logService from '../services/logServices';
import Utils from "../config/utils.js";

const user = Utils.getStore("user"); 

const props = defineProps({
  userId: String,
  rewardId: String,
});

const rewards = ref([]);
const searchQuery = ref("");
const dialog = ref(false);
const selectedReward = ref(null);
const studentInfo = ref([]);

const fetchStudentInfo = async () => {
  try {
    const response = await studentInfoServices.getStudentInfoById(props.userId);
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
  if (!hasEnoughPoints(reward.requiredPoints)) return; //check if the student has enough points
  selectedReward.value = reward; //the reward is available to purchase
  dialog.value = true; //open the dialog
};

const close = () => {
  dialog.value = false; //close the dialog
};

const purchaseReward = async () => {
  if (!selectedReward.value?.id) return;
  try {
    // Update points and purchase count
    const updateStudentInfoPoint = { 
      ...studentInfo.value[0], // Include all existing student info fields
      currentPoints: studentInfo.value[0].currentPoints - selectedReward.value.requiredPoints,
    }
    await studentInfoServices.updateStudentInfo(props.userId, updateStudentInfoPoint);

    const rewardIndex = rewards.value.findIndex(r => r.id === selectedReward.value.id);
    if (rewardIndex !== -1) {
      rewards.value[rewardIndex].purchaseCount += 1; 
    }

    await studentPurchaseService.createPurchase({
      rewardId: selectedReward.value.id,
    });

    dialog.value = false; //close dialog
    fetchStudentInfo();
    fetchRewards();
    await logService.createLog({
            name: "Puchased Reward",
            desc: user.email + " purchased the reward " + selectedReward.value.name,
            date: new Date().toISOString(),
            email: user.email, 
            type: "Points"
        })
  } catch (error) {
    console.error("Error purchasing reward:", error); //error message
  }
};

const hasEnoughPoints = (requiredPoints) => {
  return studentInfo.value.length > 0 && studentInfo.value[0].currentPoints >= requiredPoints; //check if the student has enough points
};

const filteredRewards = computed(() => {
  return rewards.value.filter(reward =>
    reward.name.toLowerCase().includes(searchQuery.value.toLowerCase()) //filtering for the search bar
  );
});

onMounted(() => {
  fetchStudentInfo();
  fetchRewards();
});
</script>
