<template>
  <v-container>

    <!-- Title-->
    <v-row justify="space-between" align="center">
      <v-col>
        <h1 class="text-center">Flight Stop</h1>
        <p class="text-center text-subtitle-1">the one way ticket to a Cool Closet</p>
      </v-col>

      <!-- Points going back to the home page for now-->
      <v-col cols="auto">
        <v-btn class="accent clickable-card" @click="goHome" elevation="6" size="x-large">
          Points : 1
        </v-btn>
      </v-col>
    </v-row>

    <!---------------->
    <!-- Search Bar -->
    <!---------------->

    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-select :items="filters" v-model="selectedFilter" label="Filter" />
      </v-col>
      <v-col cols="12" md="9">
        <v-text-field v-model="search" placeholder="Search..." prepend-inner-icon="mdi-magnify" clearable />
      </v-col>
    </v-row>

      <!-- Top Row with the images for Suit, Shirt, Pants, and Skirt -->
      <v-row>
      <v-col v-for="(item, index) in filteredItems.slice(0, 4)" :key="item.name" cols="12" sm="6" md="3" class="d-flex justify-center">
        <v-img :src="item.image" max-width="200px" aspect-ratio="1"></v-img>
      </v-col>
    </v-row>

    <!-- Row with names and points for the top row -->
    <v-row>
      <v-col v-for="(item, index) in filteredItems.slice(0, 4)" :key="item.name" cols="12" sm="6" md="3" class="d-flex justify-center">
        <v-card class="secondary" width="220px">
          <v-card-text class="d-flex justify-space-between align-center">
            <span class="text-h6">{{ item.name }}</span>
            <v-chip class="accent" size="small">{{ item.points }}</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bottom row with the Images for Dress, Shoes, Belt, and Tie -->
    <v-row>
      <v-col v-for="(item, index) in filteredItems.slice(4, 8)" :key="item.name" cols="12" sm="6" md="3" class="d-flex justify-center">
        <v-img :src="item.image" max-width="200px" aspect-ratio="1"></v-img>
      </v-col>
    </v-row>

    <!-- Row with names and points for the bottom row -->
    <v-row>
      <v-col v-for="(item, index) in filteredItems.slice(4, 8)" :key="item.name" cols="12" sm="6" md="3" class="d-flex justify-center">
        <v-card class="secondary" width="220px">
          <v-card-text class="d-flex justify-space-between align-center">
            <span class="text-h6">{{ item.name }}</span>
            <v-chip class="accent" size="small">{{ item.points }}</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>

import { computed, ref, onMounted } from 'vue';
import rewardServices from "../services/rewardServices";
import { useRouter } from 'vue-router'; 
import Utils from "../config/utils";

const router = useRouter();

//takes you back to the home page
const goHome = () => {
    router.push('/home'); 
};

const search = ref(''); //search bar stuff
const filters = ref(['All']); //the filter stuff
const items = ref([]);

const initialize = () => {
    const store = Utils.getStore();
    rewardServices.getAllrewards({
        store,
        attributes: ['id', 'rewardName', 'purchasePoints', 'image']
    })
    .then(response => {
        items.value = response.map(reward => ({
            name: reward.rewardName,
            points: reward.purchasePoints,
            image: reward.image
        }));
    })
    .catch(error => {
        console.error("Error fetching rewards:", error);
        items.value = [];
    });
};

onMounted(() => {
    initialize();
});

//how to filter the items... for now
const filteredItems = computed(() =>
  items.value.filter(item =>
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
);
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}

.v-chip {
  font-weight: bold;
}
</style>
