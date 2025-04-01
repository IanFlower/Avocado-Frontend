<template>
  <v-container>
    <v-form ref="rewardForm">
      <v-text-field v-model="reward.name" label="Name" required></v-text-field>
      <v-textarea v-model="reward.desc" label="Description" required></v-textarea>
      <v-text-field v-model.number="reward.requiredPoints" label="Required Points" type="number" required></v-text-field>

      <!-- Display current image if it exists -->
      <v-img 
        v-if="reward.image" 
        :src="reward.image" 
        max-width="200" 
        class="mt-3"
        alt="Reward Image"
      ></v-img>

      <v-file-upload 
        v-if="!reward.image || reward.image instanceof File"
        label="Upload Image" 
        @change="handleImageUpload" 
        accept="image/*" 
        class="mt-3"
      ></v-file-upload>

      <v-card-actions>
        <v-btn @click="emit('rewardUpdated')" text color="secondary-button">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="updateReward" text color="blue darken-1">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'; 
import rewardServices from '../services/rewardServices.js';
import iconServices from '../services/iconServices.js';
import { VFileUpload } from 'vuetify/labs/VFileUpload';

const props = defineProps({
  rewardId: Number,
});

const reward = ref({
  name: '',
  desc: '',
  requiredPoints: null,
  image: null, 
});

const emit = defineEmits(['rewardUpdated', 'close']);

// Function to fetch the reward by ID
const fetchReward = async () => {
  if (props.rewardId) {
    try {
      // Fetch reward data from the API
      const response = await rewardServices.getRewardById(props.rewardId);
      const rewardData = response.data;
      reward.value.name = rewardData.name;
      reward.value.desc = rewardData.desc;
      reward.value.requiredPoints = rewardData.requiredPoints;

      
      if (rewardData.iconId) {
        const iconResponse = await iconServices.getIconById(rewardData.iconId);
        
        
        if (iconResponse.data && iconResponse.data.image) {
          
          reward.value.image = iconResponse.data.image; 
        }
      }
    } catch (error) {
      console.error('Error fetching reward:', error);
    }
  }
};

onMounted(fetchReward);

// Function to handle reward update
const updateReward = async () => {
  try {
    const updatedReward = {
      id: props.rewardId,
      name: reward.value.name,
      desc: reward.value.desc,
      requiredPoints: reward.value.requiredPoints,
    };

    // If a new image is uploaded, add it
    if (reward.value.image instanceof File) {
      const iconData = new FormData();
      iconData.append('image', reward.value.image);
      const iconResponse = await iconServices.addIcon(iconData); 
      updatedReward.iconId = iconResponse.data.id; 

      console.log('Icon added/updated:', iconResponse);
    }

    const response = await rewardServices.updateReward(updatedReward);
    console.log('Reward updated:', response);

    emit('rewardUpdated');
    emit('close');
  } catch (error) {
    console.error('Error updating reward:', error);
  }
};

function handleImageUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) {
    console.error('No files selected');
    return;
  }

  const selectedImage = files[0];
  reward.value.image = selectedImage;
  console.log('Selected file:', reward.value.image);
}
</script>
