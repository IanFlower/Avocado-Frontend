<template>
  <v-dialog max-width="500px">
    <v-card>
      <v-card-title> Add Reward </v-card-title>
      <v-container>
        <v-form ref="rewardForm" v-model="formValid" lazy-validation>
          <v-text-field
            v-model="reward.name"
            label="Name"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-textarea
            v-model="reward.desc"
            label="Description"
            :rules="[rules.required]"
            required
          ></v-textarea>

          <v-text-field
            v-model.number="reward.requiredPoints"
            label="Required Points"
            type="number"
            :rules="[rules.required, rules.number]"
            required
          ></v-text-field>

          <!-- Image Upload with Validation -->
          <v-file-input
            label="Upload Image"
            accept="image/*"
            @change="handleImageUpload"
            :error-messages="imageError"
            required
          ></v-file-input>

          <v-card-actions>
            <v-btn @click="emit('rewardAdded')" text color="secondary-button">Cancel</v-btn>
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
import rewardServices from '../services/rewardServices.js';
import iconServices from '../services/iconServices.js';

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
const errorMessage = ref('');
const imageError = ref('');
const formValid = ref(false);
const emit = defineEmits(['rewardAdded']);

const rules = {
  required: (value) => !!value || 'This field is required',
  number: (value) => (!isNaN(value) && value > 0) || 'Must be a positive number',
};

const validateAndSubmit = async () => {
  const valid = await rewardForm.value.validate(); // Validate form fields

  if (!icon.value.image) {
    imageError.value = 'You must upload an image';
  } else {
    imageError.value = '';
  }

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

    const rewardResponse = await rewardServices.addReward({
      name: reward.value.name,
      desc: reward.value.desc,
      requiredPoints: reward.value.requiredPoints,
    });
    console.log('Reward Response:', rewardResponse);

    emit('rewardAdded');
  } catch (error) {
    console.error('Error adding reward:', error);
    errorMessage.value = 'An error occurred while adding the reward.';
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
