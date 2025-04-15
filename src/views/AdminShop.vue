<template>
  <p class="pa-12" style="font-size: 50px;">Purchase Rewards</p>

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
      </v-row>

      <v-data-table 
        :headers="headers" 
        :items="users" 
        :search="searchQuery" 
        item-value="fullName"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon 
            color="#004761" 
            size="large" 
            class="pa-6" 
            @click="openDialog(item.id)"
          >
            mdi-cart
          </v-icon>
        </template>

        <template v-slot:item.points="{ item }">
          <span>{{ item.currentPoints !== undefined ? item.currentPoints : 'Loading...' }}</span>
        </template>
      </v-data-table>
    </div>
  </div>

  <!-- Dialog Popup for PurchaseRewards -->
  <v-dialog v-model="dialog" max-width="1000">
    <v-card>
      <v-card-title class="text-h5 d-flex justify-space-between">
        Redeem Points
          <v-icon icon @click="dialog = false">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <PurchaseRewards :userId="selectedUserId" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import userServices from "../services/userServices.js";
import studentInfoServices from "../services/studentInfoServices.js";
import PurchaseRewards from "../components/PurchaseRewards.vue";

const users = ref([]);
const searchQuery = ref("");
const dialog = ref(false);
const selectedUserId = ref(null);

const headers = ref([
  { title: "Student Name", key: "fullName", align: "start", sortable: true },
  { title: "Id", key: "id", align: "start", sortable: true },
  { title: "Points", key: "points", align: "end", sortable: true },
  { title: "Actions", key: "actions", align: "center", sortable: false }
]);

const initialize = async () => {
  try {
    const response = await userServices.getAllUsers();
    const usersData = response.data;

    for (let user of usersData) {
      const studentInfo = await studentInfoServices.getStudentInfoById(user.id);
      user.currentPoints = studentInfo.data[0]?.currentPoints || 0;
    }

    users.value = usersData.map(user => ({
      fullName: `${user.fName} ${user.lName}`,
      id: user.id,
      points: user.points,
      currentPoints: user.currentPoints
    }));
  } catch (error) {
    console.error("Error fetching users or student info:", error);
  }
};

const openDialog = (id) => {
  selectedUserId.value = id;
  dialog.value = true;
};

onMounted(initialize);
</script>
