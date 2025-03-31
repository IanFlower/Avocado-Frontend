<template>
  <p class="pa-12 text-h3">Purchase Reward</p>

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

      <template v-slot:item.currentPoints="{ item }">
        <span>{{ studentInfo.length > 0 ? studentInfo[0].currentPoints : 'Loading...' }}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn 
          :disabled="studentInfo.length === 0 || studentInfo[0].currentPoints < item.requiredPoints" 
          color="primary" 
          class="text-none" 
          @click="confirmPurchase(item)"
          block
        >
          {{ studentInfo.length === 0 || studentInfo[0].currentPoints < item.requiredPoints ? 'Not Enough Points' : 'Purchase' }}
        </v-btn>
      </template>
    </v-data-table>
  </v-container>

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
import { ref, onMounted, defineProps } from "vue";
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

const headers = ref([
  { title: "Name", key: "name", align: "start", sortable: true },
  { title: "Description", key: "desc", align: "center", sortable: false },
  { title: "Purchase Count", key: "purchaseCount", align: "center", sortable: true },
  { title: "Required Points", key: "requiredPoints", align: "center", sortable: true },
  { title: "Current Points", key: "currentPoints", align: "center", sortable: true },
  { title: "Actions", key: "actions", align: "center", sortable: false }
]);

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
  if (studentInfo.value.length === 0 || studentInfo.value[0].currentPoints < reward.requiredPoints) {
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
    studentInfo.value[0].currentPoints -= selectedReward.value.requiredPoints;
    const rewardIndex = rewards.value.findIndex(r => r.id === selectedReward.value.id);
    if (rewardIndex !== -1) {
      rewards.value[rewardIndex].purchaseCount += 1;
    }
    await studentInfoServices.updateStudentInfo(props.userId, { currentPoints: studentInfo.value[0].currentPoints });
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
</script>
