<script setup>
import { ref, onMounted, computed } from 'vue';
import NoImageAvailable from '../assets/No_Image_Found.png'
import iconServices from '../services/iconServices.js';
import rewardServices from '../services/rewardServices.js';
import { useRouter } from 'vue-router';
// Helper Refs
const search = ref('');
const modal = ref(false);
const selectedReward = ref(null);
// Data Refs
const rewardsList = computed(() => rewards.value.filter(reward => { if(search.value == '') return true; return reward.name.toLowerCase().includes(search.value.toLowerCase())}));
const rewards = ref([]);

onMounted(async () => {
  try {
    const response = await rewardServices.getAllRewards();
    rewards.value = response.data;
    rewards.value.forEach(reward => {
      reward.image_file = null;
      if (reward.image) {
        iconServices.getIconByFile(reward.image).then(icon => {
          if(icon.data){
            reward.image_file = icon.data;
          }
        });
      }
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
  }
});

</script>

<template>
  <v-container fluid class="mt-3" style="overflow: hidden">
    <v-row align="center" justify="center">
      <v-col cols="6" offset-md="3" align="center">
        <h1>Student Shop</h1>
      </v-col>
      <v-col cols="3" class="d-flex justify-center">
        <v-btn class="text-center disable-events accent clickable-card py-8 px-13 d-flex align-center justify-center"
          elevation="6" size="x-large">
          <div class="d-flex flex-column align-center">
            <span class="font-weight-bold">Points:</span>
            <span class="text-h6">{{ selectedStudentPoints ? selectedStudentPoints : 0 }}</span>
          </div>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" offset="4">
        <v-text-field prepend-inner-icon="mdi-magnify" v-model="search" label="Search" clearable single-line
          hide-details variant="outlined" rounded="lg" density="compact"></v-text-field>
      </v-col>
    </v-row>
    <v-row style="overflow-y: auto; max-height: 70vh;">
      <v-col cols="10" offset="1">
        <v-row>
          <v-col cols="3" v-for="reward in rewardsList" :key="reward">
            <v-card height="35vh" width="15vw" class="secondary" @click="selectedReward = reward, modal = true">
              <v-img :src="reward.image_file ? `data:image/*;base64,${reward.image_file}` : NoImageAvailable"  cover crop height="28vh" width="15vw"></v-img>
              <v-spacer></v-spacer>
              <v-card-actions >
                <v-row height="7vh" class="align-center mb-1 mx-auto">
                  <v-col cols="8">
                    <span class="text-h6">{{ reward.name }}</span>
                  </v-col>
                  <v-col cols="4">
                    <v-btn :icon="`mdi-numeric-${reward.requiredPoints}`" width="2.8vw" height="2.8vw" class="accent-button disable-events">
                      {{ reward.requiredPoints }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="modal" width="30vw" max-height="30vh" >
      <v-card>
        <v-card-text>
          Description:  {{ selectedReward.desc }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="secondary-button" text @click="modal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<style scoped>
.disable-events {
  pointer-events: none
}

h1 {
  font-size: 4rem;
}
</style>