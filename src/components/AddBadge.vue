<script setup>
import { ref, defineModel, watch } from 'vue';
import badgeServices from '../services/badgeServices.js';
import iconServices from '../services/iconServices.js';
import badgeService from '../services/badgeServices.js';

// Data refs
const badge = defineModel("selectedbadge");

const icon = ref({
  image: null,
  forBadge: false,
});

// Helper refs
const badgeForm = ref(null);
const showAddbadgeDialog = defineModel("showAddbadgeDialog");
const formValid = ref(false);
const errorMessage = ref('');
const imageError = ref('');
const emit = defineEmits(['badgeAdded']);

const rules = {
  required: (value) => !!value || 'This field is required',
};

const requiredIMG = (value) => { if(value || badge.value.id >= 0) return true; return 'This field is required'; }

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
  if (!valid || (!icon.value.image && badge.value.id == 0 )) {
    errorMessage.value = 'Please fill in all fields correctly.';
    return;
  }

  try {
    if (badge.value.id > 0) {
      if(icon.value.image != null){
        const iconData = {
          image: icon.value.image,
          forBadge: icon.value.forBadge,
        };
        const iconResponse = await iconServices.addIcon(iconData);
        console.log('Icon Response:', iconResponse);
        if (!iconResponse) {
          throw new Error('Failed to add icon');
        }
        badge.value.image = iconResponse.imageUrl.replace('/uploads/', '');
      }
      await badgeService.updateBadge(badge.value)
    }
    else {
      const iconData = {
        image: icon.value.image,
        forBadge: icon.value.forBadge,
      };
      const iconResponse = await iconServices.addIcon(iconData);
      console.log('Icon Response:', iconResponse);
      if (!iconResponse) {
        throw new Error('Failed to add icon');
      }
      badge.value.image = iconResponse.imageUrl.replace('/uploads/', '');
      const badgeResponse = await badgeServices.addBadge(badge.value);
      console.log('Badge Saved:', badgeResponse);
    }

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
watch(() => showAddbadgeDialog.value, (newValue) => {
  if(newValue == false){
    icon.value.image = null;
    errorMessage.value = '';
  }
});
</script>

<template>
  <v-dialog width="60vw" v-model="showAddbadgeDialog" @update:modelValue="emit('badgeAdded')">
    <v-card>
      <v-card-title> Add Badge </v-card-title>
      <v-divider></v-divider>
      <v-form ref="badgeForm" v-model="formValid" lazy-validation>
        <v-row class="mx-12 pt-6">
          <v-col cols="6">
            <h3>Badge Details</h3>
            <v-row>
              <v-col cols="12">
                <!-- Name Field -->
                <v-text-field v-model="badge.name" label="Name" :rules="[rules.required]" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- Description Field -->
                <v-textarea v-model="badge.desc" label="Description" :rules="[rules.required]" required></v-textarea>
              </v-col>
              <v-col cols="12">
                <!-- Image Upload with Validation -->
                <v-file-input label="Upload Image" accept="image/*" @change="handleImageUpload"
                  :error-messages="imageError" :rules="[requiredIMG]" required></v-file-input>
              </v-col>
            </v-row>
          </v-col>
          <v-divider vertical inset></v-divider>
          <v-col cols="6">
            <h3>Prerequisites</h3>
            <v-divider inset ></v-divider>
            <v-row class="pt-2">
              <v-col cols="10">
                <h4>Number of flight plan items need to be completed</h4>
              </v-col>
              <v-col cols="2">
                <!-- <v-btn size="small">mdi-help</v-btn> -->
              </v-col>
              <v-col cols="6">
                <v-number-input v-model="badge.allCount" label="Any item" controlVariant="stacked"></v-number-input>
              </v-col>
              <v-col cols="6">
                <v-number-input v-model="badge.taskCount" label="Task" controlVariant="stacked"></v-number-input>
              </v-col>
              <v-col cols="6">
                <v-number-input v-model="badge.experienceCount" label="Experience" controlVariant="stacked"></v-number-input>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions>
        <v-row>
          <v-btn @click="emit('badgeAdded')" text color="secondary-button" class="mr-4">Cancel</v-btn>
          <v-btn @click="validateAndSubmit" text color="blue darken-1">Save</v-btn>
        </v-row>
      </v-card-actions>
      <!-- General Error Message (if needed) -->
      <v-alert v-if="errorMessage" type="error" class="mt-2" dense>{{ errorMessage }}</v-alert>
    </v-card>
  </v-dialog>
</template>