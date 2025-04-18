<template>
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

      <!-- Display current image if it's a URL -->
      <v-img
        v-if="reward.image && !isNewImageFile"
        :src="iconUrl"
        max-width="200"
        class="mt-3"
        alt="Reward Image"
      ></v-img>

      <!-- Upload Image -->
      <v-file-input
        v-if="!reward.image || isNewImageFile"
        label="Upload Image"
        accept="image/*"
        @change="handleImageUpload"
        :error-messages="imageError"
        class="mt-3"
        required
      ></v-file-input>

      <v-card-actions>
        <v-btn @click="emit(closeEvent)" text color="secondary-button">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="validateAndSubmit" text color="blue darken-1">Save</v-btn>
      </v-card-actions>

      <v-alert v-if="errorMessage" type="error" class="mt-2" dense>{{ errorMessage }}</v-alert>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import rewardServices from '../services/rewardServices.js';
import iconServices from '../services/iconServices.js';

const props = defineProps({
  rewardId: Number,
});

const emit = defineEmits(['rewardUpdated', 'rewardAdded', 'close']);

const reward = ref({
  name: '',
  desc: '',
  requiredPoints: null,
  image: null,
});

const formValid = ref(false);
const rewardForm = ref(null);
const errorMessage = ref('');
const imageError = ref('');

const isNewImageFile = computed(() => reward.value.image instanceof File);
const iconUrl = computed(() => reward.value.image && !isNewImageFile.value
  ? iconServices.getIcon(reward.value.image)
  : '');

const rules = {
  required: (value) => !!value || 'This field is required',
  number: (value) => (!isNaN(value) && value > 0) || 'Must be a positive number',
};

const closeEvent = computed(() => (props.rewardId ? 'rewardUpdated' : 'rewardAdded'));

onMounted(async () => {
  if (props.rewardId) {
    try {
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
});

const validateAndSubmit = async () => {
  const valid = await rewardForm.value.validate();

  if (!reward.value.image) {
    imageError.value = 'You must upload an image';
  } else {
    imageError.value = '';
  }

  if (!valid || !reward.value.image) {
    errorMessage.value = 'Please fill in all fields correctly.';
    return;
  }

  try {
    const updatedReward = {
      id: props.rewardId,
      name: reward.value.name,
      desc: reward.value.desc,
      requiredPoints: reward.value.requiredPoints,
    };

    if (isNewImageFile.value) {
      const iconData = {
        image: reward.value.image,
        forBadge: false,
      };
      const iconResponse = await iconServices.addIcon(iconData);

      if (props.rewardId) {
        updatedReward.iconId = iconResponse.id;
      } else {
        const imageUrl = iconResponse.imageUrl.replace('/uploads/', '');
        updatedReward.image = imageUrl;
      }
    }

    if (props.rewardId) {
      await rewardServices.updateReward(updatedReward);
    } else {
      await rewardServices.addReward(updatedReward);
    }

    emit(closeEvent.value);
    emit('close');
  } catch (error) {
    console.error('Error saving reward:', error);
    errorMessage.value = 'An error occurred while saving the reward.';
  }
};

function handleImageUpload(event) {
  const file = event?.target?.files?.[0] || event;
  if (file) {
    reward.value.image = file;
    imageError.value = '';
  }
}
</script>
