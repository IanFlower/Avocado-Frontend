<template>
  <v-container>
    <v-form ref="badgeForm">
      <v-text-field v-model="badge.name" label="Name" required></v-text-field>
      <v-textarea v-model="badge.desc" label="Description" required></v-textarea>

      <!-- Image Upload -->
      <v-file-upload label="Upload Image" @change="handleImageUpload" accept="image/*" required></v-file-upload>

      <v-btn @click="addBadge" color="primary">Save</v-btn>
    </v-form>
  </v-container>
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

const icon = ref(null);
const emit = defineEmits(['close']);

const addBadge = async () => {
  try {
    if (!icon.value) {
      throw new Error('No image uploaded');
    }

    // Save badge first
    const badgeResponse = await badgeServices.addBadge({
      name: badge.value.name,
      desc: badge.value.desc
    });

    console.log('Badge Saved:', badgeResponse);

    // Save icon and link it to the badge
    const iconData = { image: icon.value, forBadge: true };
    await iconServices.addIcon(iconData);

    console.log('Icon Uploaded');

    // Close the component after saving
    emit('close');
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
  icon.value = files[0];
}
</script>
