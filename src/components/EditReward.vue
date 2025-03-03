<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import rewardServices from '../services/rewardServices';


const props = defineProps({
  rewardId: Number,
});

const emit = defineEmits(['rewardUpdated', 'close']);

const name = ref('');
const desc = ref('');
const requiredPoints = ref(0);

// Fetch Reward from API
const fetchReward = async () => {
  if (props.rewardId) {
    try {
      const response = await rewardServices.getRewardById(props.rewardId);
      const reward = response.data;
      name.value = reward.name;
      desc.value = reward.desc;
      requiredPoints.value = reward.requiredPoints;
    } catch (error) {
      console.error('Error fetching reward:', error);
    }
  }
};

onMounted(fetchReward);


const updateReward = async () => {
  console.log('Update button clicked');
  
  const reward = {
    id: props.rewardId, 
    name: name.value,
    desc: desc.value,
    requiredPoints: requiredPoints.value,
  };

  console.log("Updating reward with:", reward);

  try {
    const response = await rewardServices.updateReward(reward); 
    console.log("API Response after update:", response.data);

    emit('rewardUpdated');
    emit('close'); 
  } catch (error) {
    console.error('Error updating reward:', error);
  }
};

</script>

<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-form @submit.prevent="updateReward">
          <v-text-field v-model="name" label="Name" required></v-text-field>
          <v-textarea v-model="desc" label="Description" required></v-textarea>
          <v-text-field v-model.number="requiredPoints" label="Points" type="number" required></v-text-field>
          <v-btn type="button" color="primary" class="mt-3" @click="updateReward">Save</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
