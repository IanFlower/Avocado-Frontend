<template>
  <v-container>
    <v-form ref="rewardForm">
      <v-text-field v-model="reward.name" label="Name" required></v-text-field>
      <v-textarea v-model="reward.desc" label="Description" required></v-textarea>
      <v-text-field v-model.number="reward.requiredPoints" label="Required Points" type="number"
        required></v-text-field>

      <v-file-input label="Upload Image" @change="handleImageUpload" accept="image/*" required></v-file-input>

      <v-btn @click="AddReward" color="primary">Save</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import rewardServices from '../services/rewardServices.js';

const reward = ref({
  name: '',
  desc: '',
  requiredPoints: null,
  image: ''
});

const rewardForm = ref(null);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      reward.value.image = reader.result;
    };
  }
};

const emit = defineEmits(['rewardAdded']);

const AddReward = async () => {
  console.log('Submitting reward:', reward.value);
  await rewardServices.addReward({
    name: reward.value.name,
    desc: reward.value.desc,
    requiredPoints: reward.value.requiredPoints
  });

  emit('rewardAdded');
};
</script>
