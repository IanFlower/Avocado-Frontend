<template>
    <p class="pa-12" style="font-size: 50px;">View Reward</p>
  
    <v-spacer></v-spacer>
    <div class="pa-12">
      <!-- Using Vuetify layout for top-right positioning -->
      <v-row>
        <v-col class="d-flex justify-end" cols="12">
          <v-btn @click="goBack" color="primary">
            Back to Admin Shop
          </v-btn>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="searchQuery" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
            hide-details single-line class="ma-2" />
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <v-btn class="tertiary" @click="openAddRewardDialog">
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
  
        <template v-slot:item.requiredPoints="{ item }">
          <span>{{ item.requiredPoints }}</span>
        </template>
  
        <template v-slot:item.actions="{ item }">
          <v-icon color="#004761" class="pr-3" @click="openEditRewardDialog(item)" size="large">mdi-pencil</v-icon>
  
          <v-icon @click="deleteItem(item)" color="#A30D11" size="large">mdi-delete</v-icon>
  
          <!-- Image Icon to trigger image dialog -->
          <v-icon v-if="item.image" @click="openImageDialog(item)" style="cursor: pointer;" color="primary">
            mdi-image
          </v-icon>
        </template>
      </v-data-table>
    </div>
  
    <AddReward @rewardAdded="closeAddRewardDialog" v-model="showAddRewardDialog" />
  
    <!-- Edit Reward Dialog -->
    <v-dialog v-model="editRewardDialogBox" max-width="500px">
      <v-card>
        <v-card-title>Edit Reward</v-card-title>
        <v-card-text>
          <EditReward v-if="selectedReward" :rewardId="selectedReward.id" @rewardUpdated="refreshRewards"
            @close="closeEditRewardDialog" />
  
          <div v-else>
            <p>Loading reward...</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="closeEditRewardDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <DeleteDialog
      :dialog="deleteDialog"
      :item="currentItem"
      :category="category"
      @update:dialog="deleteDialog = $event"
      @delete="refreshDeleteRewards()"
    />
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router"; // Import Vue Router
  import rewardServices from "../services/rewardServices.js";
  import AddReward from "../components/AddReward.vue";
  import EditReward from "../components/EditReward.vue";
  import DeleteDialog from "../components/DeleteDialog.vue";
  
  const router = useRouter(); // Initialize the router
  
  const editRewardDialogBox = ref(false);
  const deleteRewardDialogBox = ref(false);
  const selectedReward = ref(null);
  const deleteDialog = ref(false);
  const currentItem = ref();
  const category = "reward";
  const rewards = ref([]);
  const searchQuery = ref("");
  const showAddRewardDialog = ref(false);
  const imageDialog = ref(false);
  const imageUrl = ref(""); 
  
  const headers = ref([
    { title: "Name", key: "name", align: "start", sortable: true },
    { title: "Description", key: "desc", align: "center", sortable: false },
    { title: "Purchase Count", key: "purchaseCount", align: "center", sortable: true },
    { title: "Required Points", key: "requiredPoints", align: "center", sortable: true },
    { title: "Actions", key: "actions", align: "center", sortable: false }
  ]);
  
  const initialize = async () => {
    try {
      const response = await rewardServices.getAllRewards();
      console.log("Fetched rewards:", response.data);
  
      rewards.value = [...response.data.map(reward => ({
        id: reward.id,
        name: reward.name,
        desc: reward.desc,
        purchaseCount: reward.purchaseCount,
        requiredPoints: reward.requiredPoints,
        image: reward.image 
      }))];
    } catch (error) {
      console.error("Error fetching rewards:", error);
      rewards.value = [];
    }
  };
  
  // Open and Close functions for dialogs
  const deleteItem = (item) => {
    deleteDialog.value = true;
    currentItem.value = item;
  };
  
  const openAddRewardDialog = () => {
    showAddRewardDialog.value = true;
  };
  
  const closeAddRewardDialog = () => {
    showAddRewardDialog.value = false;
    initialize();
  };
  
  const openEditRewardDialog = (reward) => {
    selectedReward.value = reward;
    editRewardDialogBox.value = true;
  };
  
  const refreshRewards = async () => {
    console.log("Refreshing rewards...");
    await initialize();
    closeEditRewardDialog();
  };
  
  const refreshDeleteRewards = async () => {
    console.log("Refreshing rewards...");
    await initialize();
    closeDeleteRewardDialog();
  };
  
  const closeEditRewardDialog = () => {
    editRewardDialogBox.value = false;
    selectedReward.value = null;
  };
  
  const closeDeleteRewardDialog = () => {
    deleteRewardDialogBox.value = false;
    selectedReward.value = null;
  };
  
  // Image Dialog functions
  const openImageDialog = (item) => {
    imageUrl.value = item.image || "default-image-path"; 
    imageDialog.value = true;
  };
  
  const closeImageDialog = () => {
    imageDialog.value = false;
  };
  
  // Navigate back to the Admin Shop page
  const goBack = () => {
    router.push({ name: 'AdminShop' }); 
  };
  
  onMounted(initialize);
  </script>
  