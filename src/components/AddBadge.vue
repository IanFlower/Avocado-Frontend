<template>
  <v-container>
    <v-form ref="badgeForm">
      <v-text-field v-model="badge.name" label="Name" required></v-text-field>
      <v-textarea v-model="badge.desc" label="Description" required></v-textarea>

      <v-file-input label="Upload Image" @change="handleImageUpload" accept="image/*" required></v-file-input>

      <v-btn @click="handleSubmit" color="primary">Save</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import badgeServices from '../services/badgeServices.js';
import iconServices from '../services/IconServices.js';

const badge = ref({
  name: '',
  desc: '',
  image: ''
});

const icon = ref({
  name: '',
  link: '',
  forBadge: true
});

const badgeForm = ref(null);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      badge.value.image = reader.result;
      icon.value.link = reader.result; 
    };
  }
};

const emit = defineEmits(['badgeAdded']);

const addIcon = async () => {
  console.log('Submitting Icon:', icon.value);
  await iconServices.addIcon(icon.value);
};

const Addbadge = async () => {
  console.log('Submitting badge:', badge.value);
  await badgeServices.addBadge({
    name: badge.value.name,
    desc: badge.value.desc,
  });

  await addIcon();
  emit('badgeAdded');
};

const handleSubmit = async () => {
  try {
    await Addbadge();
    console.log('Badge and icon added successfully');
  } catch (error) {
    console.error('Error adding badge or icon:', error);
  }
};
</script>
