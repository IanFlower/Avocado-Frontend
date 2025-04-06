<script setup>
import { ref, onMounted } from "vue";
import badgeServices from "../services/badgeServices.js";
import AddBadge from "../components/AddBadge.vue";
import DeleteDialog from "../components/DeleteDialog.vue";
// Default constants
const emptyBadgePrerequisites = {
  awardSpecificExperience: [],
  awardSpecificTask: []
};
const emptyBadge = {
  id: '',
  name: '',
  desc: '',
  image: '',
  allCount: 0,
  taskCount: 0,
  experienceCount: 0,
  badgeSpecificTaskAND: true,
  badgeSpecificExperiencesAND: true,
};
// Helper refs
const deletebadgeDialogBox = ref(false);
const selectedBadgePrerequisites = ref(emptyBadgePrerequisites);
const selectedbadge = ref(null);

const deleteDialog = ref(false);
const currentItem = ref();
const category = "badge";

const badges = ref([]);
const searchQuery = ref("");
const showAddbadgeDialog = ref(false);

const headers = ref([
  { title: "Name", key: "name", align: "start", sortable: true },
  { title: "id", key: "id", align: "start", sortable: true },
  { title: "Description", key: "desc", align: "center", sortable: false },
  { title: "Actions", key: "actions", align: "center", sortable: false }
]);

const initialize = async () => {
  try {
    const response = await badgeServices.getAllBadges();
    console.log("Full response:", response);
    
    if (!response || !response.data || typeof response.data !== "object") {
      throw new Error("Invalid JSON response");
    }

    badges.value = response.data.map(badge => ({
      id: badge.id,
      name: badge.name,
      desc: badge.desc,
      image: badge.image
    }));
  } catch (error) {
    console.error("Error fetching badges:", error.message);
    badges.value = [];
  }
};

// Open and Close functions for dialogs
const deleteItem = (item) => {
  deleteDialog.value = true;
  currentItem.value = item;
};

const openAddbadgeDialog = () => {
  selectedbadge.value = JSON.parse(JSON.stringify(emptyBadge));
  showAddbadgeDialog.value = true;
};

const closeAddbadgeDialog = () => {
  showAddbadgeDialog.value = false;
  initialize();
};

const openEditbadgeDialog = (badge) => {
  console.log("Opening edit dialog for badge:", badge);
  if (!badge || !badge.id) {
    console.error("Invalid badge data:", badge);
    return;
  }
  selectedbadge.value = JSON.parse(JSON.stringify(badge));
  //selectedBadgePrerequisites.value = JSON.parse(JSON.stringify(emptyBadgePrerequisites));
  showAddbadgeDialog.value = true;
};

const refreshDeleteBadges = async () => {
  await initialize();
  closeDeletebadgeDialog();
};

const closeDeletebadgeDialog = () => {
  deletebadgeDialogBox.value = false;
};

onMounted(initialize);
</script>

<template>
  <p class="pa-12" style="font-size: 50px;">Admin Badges</p>
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
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <v-btn class="tertiary" @click="openAddbadgeDialog">
            Add Badge
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table 
        :headers="headers" 
        :items="badges" 
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

        <template v-slot:item.actions="{ item }">
      
            <v-icon color="#004761" class="pr-3" @click="openEditbadgeDialog(item)" size="large">mdi-pencil</v-icon>

          <v-icon @click="deleteItem(item)" color="#A30D11" size="large">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </div>
  </div>

  <AddBadge @badgeAdded="closeAddbadgeDialog" :showAddbadgeDialog="showAddbadgeDialog" :selectedbadge="selectedbadge" :selectedBadgePrerequisites="selectedBadgePrerequisites"/>

  <DeleteDialog 
    :dialog="deleteDialog"
    :item="currentItem" 
    :category="category"
    @update:dialog="deleteDialog = $event"
    @delete="refreshDeleteBadges()"
  />
</template>

