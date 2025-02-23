<template>
    <v-container>
      <v-form @submit.prevent="addReward" ref="form">
        <v-text-field
          v-model="reward.name"
          label="Reward Name"
          required
        />
        
        <v-textarea
          v-model="reward.description"
          label="Description"
          required
        />
        
        <v-text-field
          v-model="reward.points"
          label="Points"
          type="number"
          required
        />
        
        <v-file-input
          v-model="reward.image"
          label="Image Upload"
          accept="image/*"
          required
          @change="handleImageUpload"
        />
  
        <v-btn type="submit" color="primary">Save</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import rewardServices from '../services/rewardServices.js';
  
  const reward = ref({
    name: '',
    desc: '',
    points: '',
    image: null,
  });
  
  const emit = defineEmits();
  
  const handleImageUpload = (file) => {
    reward.value.image = file;
  };
  
  const addReward = async () => {
    if (reward.value.name && reward.value.desc && reward.value.points && reward.value.image) {
      try {
        await rewardServices.addReward(reward.value);
        // Emit the rewardAdded event to the parent to close the modal
        emit('reward Added');
      } catch (error) {
        console.error('Error adding reward:', error);
      }
    } else {
      console.log('Please fill out all fields.');
    }
  };
  </script>
  