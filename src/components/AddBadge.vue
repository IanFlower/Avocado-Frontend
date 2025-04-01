<template>
    <v-dialog max-width="500px">
      <v-card>
        <v-card-title> Add Badge </v-card-title>
        <v-container>
          <v-form ref="badgeForm" v-model="formValid" lazy-validation>
            <!-- Name Field -->
            <v-text-field
              v-model="badge.name"
              label="Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
  
            <!-- Description Field -->
            <v-textarea
              v-model="badge.desc"
              label="Description"
              :rules="[rules.required]"
              required
            ></v-textarea>
  
            <!-- Image Upload with Validation -->
            <v-file-input
              label="Upload Image"
              accept="image/*"
              @change="handleImageUpload"
              :error-messages="imageError"
              required
            ></v-file-input>
  
            <v-card-actions>
              <v-btn @click="emit('badgeAdded')" text color="secondary-button">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="validateAndSubmit" text color="blue darken-1">Save</v-btn>
            </v-card-actions>
  
            <!-- General Error Message (if needed) -->
            <v-alert v-if="errorMessage" type="error" class="mt-2" dense>{{ errorMessage }}</v-alert>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import badgeServices from '../services/badgeServices.js';
  import iconServices from '../services/iconServices.js';
  
  const badge = ref({
    name: '',
    desc: '',
  });
  
  const icon = ref({
    image: null,
    forBadge: true,
  });
  
  const badgeForm = ref(null);
  const formValid = ref(false);
  const errorMessage = ref('');
  const imageError = ref('');
  const emit = defineEmits(['badgeAdded']);
  
  const rules = {
    required: (value) => !!value || 'This field is required',
  };
  
  const validateAndSubmit = async () => {
    // Validate text fields
    const valid = await badgeForm.value.validate();
  
    // Validate image upload separately
    if (!icon.value.image) {
      imageError.value = 'You must upload an image';
    } else {
      imageError.value = '';
    }
  
    // Stop if validation fails
    if (!valid || !icon.value.image) {
      errorMessage.value = 'Please fill in all fields correctly.';
      return;
    }
  
    try {
      const iconData = {
        image: icon.value.image,
        forBadge: icon.value.forBadge,
      };
  
      const iconResponse = await iconServices.addIcon(iconData);
      console.log('Icon Response:', iconResponse);
  
      const badgeResponse = await badgeServices.addBadge({
        name: badge.value.name,
        desc: badge.value.desc,
      });
  
      console.log('Badge Saved:', badgeResponse);
  
      emit('badgeAdded');
    } catch (error) {
      console.error('Error adding badge:', error);
      errorMessage.value = 'An error occurred while adding the badge.';
    }
  };
  
  function handleImageUpload(event) {
    const file = event?.target?.files?.[0] || event;
    if (file) {
      icon.value.image = file;
      imageError.value = ''; // Clear error when an image is selected
    }
  }
  </script>
  