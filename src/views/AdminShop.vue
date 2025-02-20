<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Student Shop</span>
            <v-btn color="#004761" dark @click="editRewards">
              <v-icon left>mdi-plus</v-icon> Edit Rewards
            </v-btn>
          </v-card-title>
          <v-text-field v-model="searchQuery" label="Search" outlined dense class="mx-4" />
          <v-data-table
            :headers="headers"
            :items="filteredUsers"
            class="elevation-1"
          >
            <!-- Display Full Name -->
            <template v-slot:item.fullName="{ item }">
              <span>{{ item.fullName }}</span>
            </template>

            <!-- Display User ID -->
            <template v-slot:item.id="{ item }">
              <span>{{ item.id }}</span>
            </template>

            <!-- Display Points -->
            <template v-slot:item.points="{ item }">
              <span>{{ item.points }}</span>
            </template>

            <!-- Actions Column with Shopping Cart Icon -->
            <template v-slot:item.actions="{ item }">
              <v-btn icon color="primary" @click="goToRedeemPoints(item.id)">
                <v-icon>mdi-cart</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import userServices from "../services/userServices.js";

const router = useRouter();
const users = ref([]);
const searchQuery = ref("");

// Headers updated to match new user structure
const headers = ref([
  { title: "Student Name", key: "fullName", align: "start", sortable: true },
  { title: "Id", key: "id", align: "start", sortable: true },
  { title: "Points", key: "points", align: "end", sortable: true },
  { title: "Actions", key: "actions", align: "center", sortable: false }
]);

// Fetch users with specific fields (fName, lName, id, points)
const initialize = () => {
  userServices.getAllUsers()
    .then(response => {
      users.value = response.data.map(user => ({
        fullName: `${user.fName} ${user.lName}`, // Combine first and last name
        id: user.id, // Ensure we grab the ID
        points: user.points // Grab points directly
      }));
    })
    .catch(() => {
      users.value = [];
    });
};

// Filter and sort users alphabetically by full name
const filteredUsers = computed(() => {
  return users.value
    .filter(user =>
      user.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => a.fullName.localeCompare(b.fullName)); // A-Z sorting
});

const goToRedeemPoints = (userId) => {
  router.push({ name: "redeemPoints", params: { id: userId } });
};

const editRewards = () => {
  console.log("Edit Rewards Clicked");
};

onMounted(initialize);
</script>

<style scoped>
.v-container {
  padding: 20px;
}
</style>
