<script setup>
import { ref, defineModel, defineEmits, watch, onMounted } from 'vue';
import badgeServices from '../services/badgeServices.js';
import iconServices from '../services/iconServices.js';
import taskServices from '../services/tasksServices.js';
import experienceServices from '../services/experiencesServices.js';

const emit = defineEmits(['badgeAdded']);
const badge = defineModel('selectedbadge');
const showAddbadgeDialog = defineModel('showAddbadgeDialog');

// Form & validation
const badgeForm = ref(null);
const formValid = ref(false);
const errorMessage = ref('');
const imageError = ref('');
const prereqMode = ref('count'); // 'count' or 'specific'
// Image/icon handling
const icon = ref({
  image: null,
  forBadge: false,
});

// Tasks & experiences
const taskPrerequisites = ref([]);
const experiencePrerequisites = ref([]);
const tasks = ref([]);
const experiences = ref([]);

const rules = {
  required: (v) => !!v || 'This field is required',
};

const requiredIMG = (value) => {
  if (value || badge.value.id >= 0) return true;
  return 'This field is required';
};

const validateAndSubmit = async () => {
  const valid = await badgeForm.value.validate();

  if (!icon.value.image && badge.value.id === 0) {
    imageError.value = 'You must upload an image';
  } else {
    imageError.value = '';
  }

  if (!valid || (!icon.value.image && badge.value.id === 0)) {
    errorMessage.value = 'Please fill in all fields correctly.';
    return;
  }

  try {
    // Upload new icon if available
    if (icon.value.image) {
      const iconResponse = await iconServices.addIcon(icon.value);
      if (!iconResponse) throw new Error('Failed to add icon');

      badge.value.image = iconResponse.imageUrl.replace('/uploads/', '');
    }

    if (badge.value.id > 0) {
      await badgeServices.updateBadge(badge.value);
    } else {
      await badgeServices.addBadge(badge.value);
    }

    emit('badgeAdded');
  } catch (err) {
    console.error('Error saving badge:', err);
    errorMessage.value = 'An error occurred while saving the badge.';
  }
};

const handleImageUpload = (event) => {
  const file = event?.target?.files?.[0] || event;
  if (file) {
    icon.value.image = file;
    imageError.value = '';
  }
};

// Watch for pen and close of modal
watch(() => showAddbadgeDialog.value, (open) => {
  if (!open) {
    icon.value.image = null;
    errorMessage.value = '';
    taskPrerequisites.value = [];
    experiencePrerequisites.value = [];
  }
  if(open){
    taskPrerequisites.value = [];
    experiencePrerequisites.value = [];
    if(taskPrerequisites.length || experiencePrerequisites.length) prereqMode.value = 'specific';
    else prereqMode.value = 'count';
  }
});

// On mount get Task/Experience data no need to refresh
onMounted(async () => {
  try {
    tasks.value = (await taskServices.getAll()).data;
  } catch (err) {
    console.error('Error fetching tasks:', err);
    tasks.value = [];
  }
  try {
    experiences.value = (await experienceServices.getAll()).data;
  } catch (err) {
    console.error('Error fetching experiences:', err);
    experiences.value = [];
  }
});
</script>

<template>
  <v-dialog v-model="showAddbadgeDialog" width="60vw" @update:modelValue="emit('badgeAdded')">
    <v-card>
      <v-card-title>Add Badge</v-card-title>
      <v-divider />

      <v-form ref="badgeForm" v-model="formValid" lazy-validation>
        <v-row class="mx-12 pt-6">
          <!-- Left Side: Badge Details -->
          <v-col cols="6">
            <h3>Badge Details</h3>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="badge.name" label="Name" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="badge.desc" label="Description" :rules="[rules.required]" required />
              </v-col>
              <v-col cols="12">
                <v-file-input label="Upload Image" accept="image/*" @change="handleImageUpload"
                  :error-messages="imageError" :rules="[requiredIMG]" required />
              </v-col>
            </v-row>
          </v-col>

          <v-divider vertical inset />

          <!-- Right Side: Prerequisites -->
          <v-col cols="6">
            <h3>Prerequisites</h3>
            <v-divider inset />

            <!-- Radio Toggle -->
            <v-radio-group v-model="prereqMode" row class="mt-4 mb-4">
              <v-radio label="By Count" value="count" />
              <v-radio label="By Specific Tasks/Experiences" value="specific" />
            </v-radio-group>
            <v-divider class="mb-2"></v-divider>
            <!-- Count Mode -->
            <v-row v-if="prereqMode === 'count'" dense>
              <v-col cols="12">
                <h4 class="text-subtitle-1 font-weight-medium mb-2">
                  Number of Flight Plan Items Required
                </h4>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="badge.allCount" label="Any Item" type="number" density="compact" hide-details
                  variant="outlined" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="badge.taskCount" label="Tasks" type="number" density="compact" hide-details
                  variant="outlined" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="badge.experienceCount" label="Experiences" type="number" density="compact"
                  hide-details variant="outlined" />
              </v-col>
            </v-row>
            <!-- Specific Mode -->
            <v-row v-if="prereqMode === 'specific'" dense>
              <v-col cols="2">
                <v-switch color="#004761" :label="badge.badgeSpecificTaskAND ? 'All' : 'Any'"
                  v-model="badge.badgeSpecificTaskAND" />
              </v-col>
              <v-col cols="10">
                <v-select v-model="taskPrerequisites" :items="tasks" item-value="id" item-title="name" clearable
                  multiple chips label="Tasks" />
              </v-col>
              <v-col cols="12">
                <v-col cols="6" offset="6">
                <v-text-field v-model="badge.taskCount" label="# needed to complete" type="number" density="compact"
                  hide-details variant="outlined" v-if="!badge.badgeSpecificTaskAND" />
                </v-col>
              </v-col>
              <v-divider class="mb-2"></v-divider>
              <v-col cols="2">
                <v-switch color="#004761" :label="badge.badgeSpecificExperiencesAND ? 'All' : 'Any'"
                  v-model="badge.badgeSpecificExperiencesAND" />
              </v-col>
              <v-col cols="10">
                <v-select v-model="experiencePrerequisites" :items="experiences" item-value="id" item-title="name"
                  clearable multiple chips label="Experiences" />
              </v-col>
              <v-col cols="6" offset="6">
                <v-text-field v-model="badge.experienceCount" label="# needed to complete" type="number" density="compact"
                  hide-details variant="outlined"  v-if="!badge.badgeSpecificExperiencesAND"/>
              </v-col>
            </v-row>
            <!-- End Prerequisites -->
          </v-col>
        </v-row>
      </v-form>

      <!-- Footer Buttons -->
      <v-card-actions>
        <v-row class="px-4 pb-2" justify="end">
          <v-btn text color="secondary-button" class="mr-2" @click="emit('badgeAdded')">
            Cancel
          </v-btn>
          <v-btn text color="primary" @click="validateAndSubmit">
            Save
          </v-btn>
        </v-row>
      </v-card-actions>

      <v-alert v-if="errorMessage" type="error" class="mt-2 mx-4" dense>
        {{ errorMessage }}
      </v-alert>
    </v-card>
  </v-dialog>
</template>
