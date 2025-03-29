<template>
  <v-container>
    <v-form ref="rewardForm">
      <v-text-field v-model="reward.name" label="Name" required></v-text-field>
      <v-textarea v-model="reward.desc" label="Description" required></v-textarea>
      <v-text-field v-model.number="reward.requiredPoints" label="Required Points" type="number"
        required></v-text-field>

      <!-- Image Upload -->
      <v-file-upload label="Upload Image" @change="handleImageUpload" accept="image/*" required></v-file-upload>

      <v-btn @click="AddReward" color="blue darken-1">Save</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import rewardServices from '../services/rewardServices.js';
import iconServices from '../services/iconServices.js';
import { VFileUpload } from 'vuetify/labs/VFileUpload';

const reward = ref({
  name: '',
  desc: '',
  requiredPoints: null,
});

const icon = ref({
  image: null,
  forBadge: false,
});

const rewardForm = ref(null);

const emit = defineEmits(['rewardAdded']);

const AddReward = async () => {
  try {
    if (!icon.value.image) {
      throw new Error('No image uploaded');
    }

    const iconData = {
      image: icon.value.image,
      forBadge: icon.value.forBadge,
    };

    const iconResponse = await iconServices.addIcon(iconData);
    console.log('Icon Response:', iconResponse);

    const rewardResponse = await rewardServices.addReward({
      name: reward.value.name,
      desc: reward.value.desc,
      requiredPoints: reward.value.requiredPoints,
    });
    console.log('Reward Response:', rewardResponse);

    emit('rewardAdded');
  } catch (error) {
    console.error('Error adding reward:', error);
  }
};


function handleImageUpload(event) {
  const files = event.target.files;

  if (!files || files.length === 0) {
    console.error('No files selected');
    return;
  }

  const selectedImage = files[0];
  console.log('Selected file:', selectedImage);

  // Store the file object in the icon ref
  icon.value.image = selectedImage;

  console.log("Selected Image:", icon.value.image);
}
</script>
