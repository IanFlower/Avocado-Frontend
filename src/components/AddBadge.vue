<template>
  <v-container>
    <v-form ref="badgeForm">
      <v-text-field v-model="badge.name" label="Name" required></v-text-field>
      <v-textarea v-model="badge.desc" label="Description" required></v-textarea>

      <!-- Image Upload -->
      <v-file-upload label="Upload Image" @change="handleImageUpload" accept="image/*" required></v-file-upload>

      <v-btn @click="AddBadge" color="primary">Save</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import badgeServices from '../services/badgeServices.js';
import iconServices from '../services/iconServices.js';

const badge = ref({
  name: '',
  desc: '',
  iconUrl: '',  // Store the URL of the uploaded icon
});

const icon = ref({
  image: null,
  forBadge: true,
});

const badgeForm = ref(null);

const emit = defineEmits(['badgeAdded']);

const AddBadge = async () => {
  try {
    if (!icon.value.image) {
      throw new Error('No image uploaded');
    }

    // First, upload the icon and get the image URL
    const iconData = {
      image: icon.value.image,
      forBadge: icon.value.forBadge,
    };

    const iconResponse = await iconServices.addIcon(iconData);
    console.log('Icon Response:', iconResponse);

    // Once the icon is uploaded, use the URL for the badge
    badge.value.iconUrl = iconResponse.imageUrl;  // This is the uploaded icon URL

    // Now create the badge
    const badgeResponse = await badgeServices.addBadge({
      name: badge.value.name,
      desc: badge.value.desc,
      iconUrl: badge.value.iconUrl,  // Send the icon URL when creating the badge
    });

    console.log('Badge Response:', badgeResponse);

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

  // Store the file object in the icon ref
  icon.value.image = selectedImage;

  console.log('Selected Image:', icon.value.image);
}
</script>
