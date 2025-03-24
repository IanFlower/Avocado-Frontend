<template>
  <v-container>
    <v-form ref="rewardForm">
      <v-text-field v-model="reward.name" label="Name" required></v-text-field>
      <v-textarea v-model="reward.desc" label="Description" required></v-textarea>
      <v-text-field v-model.number="reward.requiredPoints" label="Required Points" type="number"
        required></v-text-field>

      <v-file-upload label="Upload Image" @change="handleImageUpload" accept="image/*" required></v-file-upload>

      <v-btn @click="AddReward" color="primary">Save</v-btn>
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
  image: '',
  forBadge: false
});

const rewardForm = ref(null);

const emit = defineEmits(['rewardAdded']);

const AddReward = async () => {
  try {
    const iconData = {
      image: icon.value.image, // The file selected by the user
      forBadge: false, // Example: assuming you're passing a boolean for badges
    };

    const iconResponse = await iconServices.addIcon(iconData);
    console.log('Icon Response:', iconResponse);

    const rewardResponse = await rewardServices.addReward({
      name: reward.value.name,
      desc: reward.value.desc,
      requiredPoints: reward.value.requiredPoints
    });
    console.log('Reward Response:', rewardResponse);

    emit('rewardAdded');
  } catch (error) {
    console.error('Error adding reward:', error);
  }
};

function handleImageUpload(e) {
  const selectedImage = e.target.files[0]; 
  const formData = new FormData();
  formData.append('image', selectedImage); 

  fetch('http://localhost:3032/upload', {
    method: 'POST',
    body: formData, 
  })
    .then(response => response.json())
    .then(data => {
      icon.value.image = `http://localhost:3032${data.imageUrl}`;
      console.log('Uploaded Image URL:', icon.value.image); 
    })
    .catch(error => console.error('Upload Error:', error)); 
}
</script>
