<template>
  <p class="pa-12" style="font-size: 50px;">Admin Shop</p>

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
          <v-btn class="tertiary" @click="editRewards">
            Rewards
          </v-btn>
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
            @click="goToRedeemPoints(item.id)"
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import userServices from "../services/userServices.js";
import studentInfoServices from "../services/studentInfoServices.js";

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

const goToRedeemPoints = (id) => {
  console.log("Navigating to purchase rewards with userId:", id);
  router.push({ name: "purchaseRewards", params: { userId: id } });
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
