<template>
  <p class="pa-12" style="font-size: 50px;">View Reward</p>

  <v-spacer></v-spacer>
  <div>
    <div class="pa-12">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="searchQuery" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
            hide-details single-line class="ma-2" />
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <v-btn class="custom-btn" @click="showAddRewardDialog = true">
            Add Reward
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table :headers="headers" :items="rewards" :search="searchQuery" item-value="name" class="elevation-1">
        <template v-slot:item.name="{ item }">
          <span>{{ item.name }}</span>
        </template>

        <template v-slot:item.desc="{ item }">
          <span>{{ item.desc }}</span>
        </template>

        <template v-slot:item.purchaseCount="{ item }">
          <span>{{ item.purchaseCount }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <!-- Edit Button -->
          <v-btn icon class="transparent no-padding" @click="openEditRewardDialog(item)">
            <v-icon color="#004761" size="large">mdi-pencil</v-icon>
          </v-btn>

          <!-- Delete Button -->
          <v-btn icon class="transparent no-padding" @click="openDeleteRewardDialog(item)">
            <v-icon color="#A30D11" size="large">mdi-delete</v-icon>
          </v-btn>
        </template>

      </v-data-table>
    </div>
  </div>

  <!-- Add Reward Dialog -->
  <v-dialog v-model="showAddRewardDialog" max-width="500px">
    <v-card>
      <v-card-title>
        Add Reward
      </v-card-title>
      <v-card-text>
        <AddReward @rewardAdded="closeAddRewardDialog" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="showAddRewardDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

<!-- Edit Reward Dialog -->
<v-dialog v-model="editRewardDialogBox" max-width="500px">
  <v-card>
    <v-card-title>Edit Reward</v-card-title>
    <v-card-text>

      <!-- Use v-show or make sure selectedReward is populated correctly -->
      <EditReward 
        v-if="selectedReward && selectedReward.value.id" 
        :rewardId="selectedReward.value.id" 
        @rewardUpdated="initialize"
      />
      <div v-else>
        <p>Loading reward...</p>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red" text @click="editRewardDialogBox = false">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  <!-- Delete Reward Dialog -->
  <v-dialog v-model="deleteRewardDialogBox" max-width="400px">
    <v-card>
      <v-card-title>Delete Reward</v-card-title>
      <v-card-text>
        <DeleteReward :reward="selectedReward" @rewardDeleted="initialize" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="deleteRewardDialogBox = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import rewardServices from "../services/rewardServices.js";
import AddReward from "../components/AddReward.vue";
import EditReward from "../components/EditReward.vue";
import DeleteReward from "../components/DeleteReward.vue";

const editRewardDialogBox = ref(false);
const deleteRewardDialogBox = ref(false);
const selectedReward = ref(null);

// Rewards data and search
const rewards = ref([]);
const searchQuery = ref("");
const showAddRewardDialog = ref(false);

// Table headers
const headers = ref([
  { title: "Name", key: "name", align: "start", sortable: true },
  { title: "Description", key: "desc", align: "center", sortable: true },
  { title: "Purchase Count", key: "purchaseCount", align: "center", sortable: true },
  { title: "Actions", key: "actions", align: "center", sortable: false }
]);

// Fetch rewards from the database
const initialize = () => {
  rewardServices.getAllrewards()
    .then(response => {
      rewards.value = response.data.map(reward => ({
        name: reward.name,
        desc: reward.desc,
        purchaseCount: reward.purchaseCount,
        image: reward.image
      }));
    })
    .catch(() => {
      rewards.value = [];
    });
};

const closeAddRewardDialog = () => {
  showAddRewardDialog.value = false;
  initialize();
};

// Open Edit Reward Dialog
const openEditRewardDialog = (reward) => {
  console.log('Selected Reward:', selectedReward.value);  // Corrected logging
  selectedReward.value = reward; // Corrected assignment
  editRewardDialogBox.value = true; 
};

// Open Delete Reward Dialog
const openDeleteRewardDialog = (reward) => {
  selectedReward.value = reward;
  deleteRewardDialogBox.value = true;
};

onMounted(initialize);
</script>

