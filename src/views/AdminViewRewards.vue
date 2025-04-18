<template>
  <p class="pa-12" style="font-size: 50px;">Reward Management</p>

  <v-spacer></v-spacer>
  <div>
    <div class="pa-12">
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
          <v-btn class="tertiary" @click="openAddRewardDialog">
            Add Reward
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="rewards"
        :search="searchQuery"
        item-value="name"
        class="elevation-1"
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

        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2 teritary" size="large" @click="openEditRewardDialog(item)">mdi-pencil</v-icon>
          <v-icon @click="deleteItem(item)" color="#A30D11" size="large">mdi-delete</v-icon>
          <v-icon
            v-if="item.image"
            @click="openImageDialog(item)"
            style="cursor: pointer;"
            color="primary"
          >
            mdi-image
          </v-icon>
        </template>
      </v-data-table>
    </div>
  </div>

  <!-- Add Reward Dialog -->
  <v-dialog v-model="showAddRewardDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6">Add Reward</span>
      </v-card-title>
      <v-card-text>
        <RewardForm @rewardAdded="closeAddRewardDialog" @close="closeAddRewardDialog" />
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Edit Reward Dialog -->
  <v-dialog v-model="editRewardDialogBox" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6">
          {{ selectedReward ? 'Edit Reward' : 'Loading...' }}
        </span>
      </v-card-title>
      <v-card-text>
        <RewardForm
          v-if="selectedReward"
          :rewardId="selectedReward.id"
          @rewardUpdated="refreshRewards"
          @close="closeEditRewardDialog"
        />
        <div v-else>
          <p>Loading reward...</p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Image Dialog -->
  <v-dialog v-model="imageDialog" max-width="800px">
    <v-card>
      <v-card-title class="headline">Reward Image</v-card-title>
      <v-card-text>
        <v-img :src="imageUrl" max-width="100%" height="400px" cover class="rounded" />
      </v-card-text>
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
import rewardServices from "../services/rewardServices.js";
import RewardForm from "../components/RewardForm.vue";
import DeleteDialog from "../components/DeleteDialog.vue";
import iconService from "../services/iconServices.js";
import NoImageAvailable from "../assets/No_Image_Found.png";

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
  { title: "Actions", key: "actions", align: "center", sortable: false },
]);

const initialize = async () => {
  try {
    const response = await rewardServices.getAllRewards();
    rewards.value = response.data.map((reward) => ({
      id: reward.id,
      name: reward.name,
      image: reward.image,
      desc: reward.desc,
      purchaseCount: reward.purchaseCount,
      requiredPoints: reward.requiredPoints,
    }));
  } catch (error) {
    console.error("Error fetching rewards:", error);
    rewards.value = [];
  }
};

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
  await initialize();
  closeEditRewardDialog();
};

const refreshDeleteRewards = async () => {
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

const openImageDialog = async (item) => {
  if (!item.image) {
    console.warn("No image found for this reward.");
    imageUrl.value = NoImageAvailable;
    imageDialog.value = true;
    return;
  }

  try {
    const response = await iconService.getIconByFile(item.image);

    if (typeof response.data === "string") {
      imageUrl.value = `data:image/*;base64,${response.data}`;
    } else {
      console.warn("Image data was not a base64 string, using fallback.");
      imageUrl.value = NoImageAvailable;
    }

    imageDialog.value = true;
  } catch (error) {
    console.error("Failed to load image:", error);
    imageUrl.value = NoImageAvailable;
    imageDialog.value = true;
  }
};

onMounted(initialize);
</script>
