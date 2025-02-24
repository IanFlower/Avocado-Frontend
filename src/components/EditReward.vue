<template>
  <v-container>
    <v-form @submit.prevent="updateReward" ref="form">
      <v-text-field v-model="reward.name" label="Reward Name" required />

      <v-textarea v-model="reward.desc" label="Description" required />

      <v-text-field v-model="reward.points" label="Points" type="number" required />

      <v-file-input label="Image Upload" accept="image/*" @change="handleImageUpload" />

      <v-btn type="submit" color="primary">Update</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import rewardServices from '../services/rewardServices.js';

const props = defineProps({
  rewardId: {
    type: Number,
    required: true,
  },
});

const reward = ref({
  id: null,
  name: '',
  desc: '',
  points: '',
  image: null,
});

const emit = defineEmits(['rewardUpdated']);

const handleImageUpload = (event) => {
  const file = event?.target?.files?.[0] || null;
  reward.value.image = file;
};

// Fetch the existing reward data when the component is mounted
onMounted(async () => {
  try {
    const fetchedReward = await rewardServices.getRewardById(props.rewardId);
    reward.value = fetchedReward;
  } catch (error) {
    console.log(`Error fetching reward: ${error}`);
  }
});

// Update the reward data
const updateReward = async () => {
  try {
    await rewardServices.updateReward(reward.id);
    console.log('Reward updated successfully');
    emit('rewardUpdated');
  } catch (error) {
    console.log(`Error updating reward: ${error}`);
  }
};
</script>
