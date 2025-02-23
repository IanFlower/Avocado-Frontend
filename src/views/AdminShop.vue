<template>
  <p class="pa-12" style="font-size: 50px;">Admin Shop</p>

  <v-spacer></v-spacer>
  <div>
    <div class="pa-12">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="searchQuery" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
            single-line class="ma-2"></v-text-field>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <!-- Use the custom class for color -->
          <v-btn class="custom-btn" @click="editRewards">
            Edit Rewards
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table :headers="headers" :items="users" :search="searchQuery" item-value="fullName">
        <template v-slot:item.actions="{ item }">
          <v-icon color="#004761" size="large" class="pa-6" @click="goToRedeemPoints(item.id)">mdi-cart</v-icon>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import userServices from "../services/userServices.js";

const router = useRouter();
const users = ref([]);
const searchQuery = ref("");

const headers = ref([
  { title: "Student Name", key: "fullName", align: "start", sortable: true },
  { title: "Id", key: "id", align: "start", sortable: true },
  { title: "Points", key: "points", align: "end", sortable: true },
  { title: "Actions", key: "actions", align: "center", sortable: false }
]);

const initialize = async () => {
  try {
    const response = await userServices.getAllUsers();
    users.value = response.data.map(user => ({
      fullName: `${user.fName} ${user.lName}`,
      id: user.id,
      points: user.points
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const goToRedeemPoints = () => {
  //router.push({ name: "redeemPoints", params: { id: userId } });
  console.log("redeem points works! with " )
};

const editRewards = () => {
  router.push({ name: "ViewRewards" });
  console.log("Edit Rewards Clicked");
};

onMounted(initialize);
</script>

<style scoped>
.custom-btn {
  background-color: #004761;
  color: white;
}

.custom-btn:hover {
  background-color: #003b4e;
}
</style>
