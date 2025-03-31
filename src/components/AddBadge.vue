<template>
  <v-dialog max-width="500px">
    <v-card>
      <v-card-title> Add Badge </v-card-title>
  <v-container>
    <v-form ref="badgeForm">
      <v-text-field v-model="badge.name" label="Name" required></v-text-field>
      <v-textarea v-model="badge.desc" label="Description" required></v-textarea>

      <!-- Image Upload -->
      <v-file-upload label="Upload Image" @change="handleImageUpload" accept="image/*" required></v-file-upload>

      <v-card-actions>
        <v-btn @click="emit('badgeAdded')" text color="secondary-button">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="addBadge" text color="blue darken-1">Save</v-btn>
      </v-card-actions>
      
     </v-form>
  </v-container>
</v-card>
</v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import badgeServices from '../services/badgeServices.js';
import iconServices from '../services/iconServices.js';
import { VFileUpload } from 'vuetify/labs/VFileUpload';

const badge = ref({
  name: '',
  desc: ''
});

const icon = ref({
  image: null,
  forBadge: true,
});

const badgeForm = ref(null);

const emit = defineEmits(['badgeAdded']);


const addBadge = async () => {
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

    // Save badge first
    const badgeResponse = await badgeServices.addBadge({
      name: badge.value.name,
      desc: badge.value.desc
    });

    console.log('Badge Saved:', badgeResponse);

    
    emit('badgeAdded');
  } catch (error) {
    console.error('Error adding badge:', error);
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

  
  icon.value.image = selectedImage;

  console.log("Selected Image:", icon.value.image);
}
</script>
