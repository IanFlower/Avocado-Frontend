<template>
  <v-container>
    <!-- Search Bar -->
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
    </v-row>

    <!-- Rewards List -->
    <v-row
      v-for="reward in filteredRewards"
      :key="reward.id"
      class="mb-3 pa-2 rounded-lg"
      style="border: 1px solid #ccc;"
    >
      <v-col cols="2">
        <strong>{{ reward.name }}</strong>
      </v-col>
      <v-col cols="2">
        Purchased: {{ reward.purchaseCount }}
      </v-col>
      <v-col cols="2">
        Required: {{ reward.requiredPoints }}
      </v-col>
      <v-col cols="3">
        Your Points:
        <span class="font-weight-bold">
          {{ studentInfo.length > 0 ? studentInfo[0].currentPoints : 'Loading...' }}
        </span>
      </v-col>
      <v-col cols="3">
        <v-btn
          :disabled="!hasEnoughPoints(reward.requiredPoints)"
          color="primary"
          block
          @click="confirmPurchase(reward)"
        >
          {{ hasEnoughPoints(reward.requiredPoints) ? 'Purchase' : 'Not Enough Points' }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Confirm Purchase Dialog -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirm Purchase</v-card-title>
        <v-card-text>
          Would you like to purchase <strong>{{ selectedReward?.name }}</strong>?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="success" variant="text" @click="purchaseReward">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import rewardServices from "../services/rewardServices.js";
import studentInfoServices from "../services/studentInfoServices.js";

const props = defineProps({
  userId: String,
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
  if (!hasEnoughPoints(reward.requiredPoints)) {
    return;
  }
  selectedReward.value = reward;
  dialog.value = true;
};

const purchaseReward = async () => {
  if (!selectedReward.value || !selectedReward.value.id) {
    return;
  }
  try {
    // Deduct points locally
    studentInfo.value[0].currentPoints -= selectedReward.value.requiredPoints;

    // Increment reward's purchase count locally
    const rewardIndex = rewards.value.findIndex(r => r.id === selectedReward.value.id);
    if (rewardIndex !== -1) {
      rewards.value[rewardIndex].purchaseCount += 1;
    }

    // Update backend
    await studentInfoServices.updateStudentInfo(props.userId, {
      currentPoints: studentInfo.value[0].currentPoints,
    });

    dialog.value = false;
    fetchStudentInfo();
  } catch (error) {
    console.error("Error purchasing reward:", error);
  }
};

const hasEnoughPoints = (requiredPoints) => {
  return studentInfo.value.length > 0 && studentInfo.value[0].currentPoints >= requiredPoints;
};

const filteredRewards = computed(() => {
  return rewards.value.filter(reward =>
    reward.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  fetchStudentInfo();
  fetchRewards();
});
</script>
