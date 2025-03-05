<template>
    <p class="pa-12" style="font-size: 50px;">View badge</p>

    <v-spacer></v-spacer>
    <div>
        <div class="pa-12">
            <v-row>
                <v-col cols="6">
                    <v-text-field v-model="searchQuery" label="Search" prepend-inner-icon="mdi-magnify"
                        variant="outlined" hide-details single-line class="ma-2" />
                </v-col>
                <v-col cols="6" class="d-flex justify-end">
                    <v-btn class="custom-btn" @click="openAddbadgeDialog">
                        Add badge
                    </v-btn>
                </v-col>
            </v-row>

            <v-data-table :headers="headers" :items="badges" :search="searchQuery" item-value="name"
                class="elevation-1">
                <template v-slot:item.name="{ item }">
                    <span>{{ item.name }}</span>
                </template>

                <template v-slot:item.desc="{ item }">
                    <span>{{ item.desc }}</span>
                </template>


                <template v-slot:item.image="{ }">
                    <span>Not Available</span>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-btn icon class="transparent no-padding" @click="openEditbadgeDialog(item)">
                        <v-icon color="#004761" size="large">mdi-pencil</v-icon>
                    </v-btn>

                    <!-- <v-btn icon class="transparent no-padding" @click="openDeletebadgeDialog(item)"> -->
                    <v-icon @click="deleteItem(item)" color="#A30D11" size="large">mdi-delete</v-icon>
                    <!-- </v-btn> -->
                </template>
            </v-data-table>
        </div>
    </div>

    <!-- Add badge Dialog -->
    <v-dialog v-model="showAddbadgeDialog" max-width="500px">
        <v-card>
            <v-card-title>Add badge</v-card-title>
            <v-card-text>
                <Addbadge @badgeAdded="closeAddbadgeDialog" />
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" text @click="closeAddbadgeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Edit badge Dialog -->
    <v-dialog v-model="editbadgeDialogBox" max-width="500px">
        <v-card>
            <v-card-title>Edit badge</v-card-title>
            <v-card-text>
                <Editbadge v-if="selectedbadge" :badgeId="selectedbadge.id" @badgeUpdated="refreshbadges"
                    @close="closeEditbadgeDialog" />

                <div v-else>
                    <p>Loading badge...</p>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" text @click="closeEditbadgeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Delete badge Dialog -->
    <v-dialog v-model="deletebadgeDialogBox" max-width="400px">
        <v-card>
            <v-card-title>Delete badge</v-card-title>
            <v-card-text>
                <DeleteDialog :dialog="deleteDialog" :item="currentItem" :category="category"
                    @update:dialog="deleteDialog = $event" @delete="refreshDeletebadges()" />
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" text @click="closeDeletebadgeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script setup>
import { ref, onMounted } from "vue";
import badgeServices from "../services/badgeServices.js";
import Addbadge from "../components/Addbadge.vue";
import Editbadge from "../components/Editbadge.vue";
import DeleteDialog from "../components/DeleteDialog.vue";

const editbadgeDialogBox = ref(false);
const deletebadgeDialogBox = ref(false);
const selectedbadge = ref(null);

const deleteDialog = ref(false);
const currentItem = ref();
const category = "badge";

const badges = ref([]);
const searchQuery = ref("");
const showAddbadgeDialog = ref(false);

const headers = ref([
    { title: "Name", key: "name", align: "start", sortable: true },
    { title: "Description", key: "desc", align: "center", sortable: false },
    { title: "Image", key: "image", align: "center", sortable: false },
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
      desc: badge.desc
    }));
  } catch (error) {
    console.error("Error fetching badges:", error.message);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }

    badges.value = [];
  }
};






// Open and Close functions for dialogs


const deleteItem = (item) => {
    console.log(category, currentItem, item)
    deleteDialog.value = true;
    currentItem.value = item;
}


const openAddbadgeDialog = () => {
    showAddbadgeDialog.value = true;
};

const closeAddbadgeDialog = () => {
    showAddbadgeDialog.value = false;
    initialize();
};

const openEditbadgeDialog = (badge) => {
    selectedbadge.value = badge;
    editbadgeDialogBox.value = true;
};

const refreshbadges = async () => {
    console.log("Refreshing badges...");
    await initialize();
    closeEditbadgeDialog();
};

const refreshDeletebadges = async () => {
    console.log("Refreshing badges...");
    await initialize();
    closeDeletebadgeDialog();
};

const closeEditbadgeDialog = () => {
    editbadgeDialogBox.value = false;
    selectedbadge.value = null;
};

const openDeletebadgeDialog = (badge) => {
    selectedbadge.value = badge;
    deletebadgeDialogBox.value = true;
};

const closeDeletebadgeDialog = () => {
    deletebadgeDialogBox.value = false;
    selectedbadge.value = null;
};

onMounted(initialize);
</script>