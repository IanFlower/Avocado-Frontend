<script setup>
import { ref, defineModel, defineEmits, watch, onMounted } from 'vue';
import badgeServices from '../services/badgeServices.js';
import iconServices from '../services/iconServices.js';
import taskServices from '../services/tasksServices.js';
import experienceServices from '../services/experiencesServices.js';
import badgeSpecificTaskService from '../services/badgeSpecificTaskService.js';
import badgeSpecificExperienceService from '../services/badgeSpecificExperience.js';
import { id } from 'vuetify/locale';

const emit = defineEmits(['badgeAdded']);
const badge = defineModel('selectedbadge');
const showAddbadgeDialog = defineModel('showAddbadgeDialog');
// Form & validation
const badgeForm = ref(null);
const formValid = ref(false);
const errorMessage = ref('');
const imageError = ref('');
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
  if (badge.value.id === 0) {
    return (!!value || !!icon.value.image) || 'Image is required when creating a new badge';
  }
  return true;
};

const validateAndSubmit = async () => {
  const valid = await badgeForm.value.validate();

  // Clear previous error messages
  imageError.value = '';
  errorMessage.value = '';

  // Specific image validation for new badges
  if (badge.value.id === 0) {
    if (!icon.value.image) {
      imageError.value = 'You must upload an image for a new badge';
      return false;
    }
  }

  if (!valid) {
    errorMessage.value = 'Please fill in all fields correctly.';
    return false;
  }

  try {
    // Upload new icon if available
    if (icon.value.image) {
      const iconResponse = await iconServices.addIcon(icon.value);
      if (!iconResponse) {
        errorMessage.value = 'Failed to upload icon';
        return false;
      }

      badge.value.image = iconResponse.imageUrl.replace('/uploads/', '');
    }

    if (badge.value.id > 0) {
      await badgeServices.updateBadge(badge.value);
      await badgeSpecificTaskService.deleteByBadgeId(badge.value.id).catch(() => {});
      await badgeSpecificExperienceService.deleteByBadgeId(badge.value.id).catch(() => {});
    } else {
      // Strict validation for new badges
      if (!badge.value.image) {
        imageError.value = 'Image is required when creating a new badge';
        return false;
      }
      badge.value = (await badgeServices.addBadge(badge.value)).data;
    }

    if(!badge.value.byCount) {
      if(taskPrerequisites.value.length > 0) {
        taskPrerequisites.value.forEach(task => {
          badgeSpecificTaskService.create({
            badgeId: badge.value.id,
            taskId: task
          });
        });
      }
    }

    if(experiencePrerequisites.value.length > 0) {
      experiencePrerequisites.value.forEach(experience => {
        badgeSpecificExperienceService.create({
          badgeId: badge.value.id,
          experienceId: experience
        });
      });
    }
    
    emit('badgeAdded');
    return true;
  } catch (err) {
    console.error("Error saving badge:", err);
    errorMessage.value = 'An error occurred while saving the badge.';
    return false;
  }
};

const handleImageUpload = (event) => {
  const file = event?.target?.files?.[0] || event;
  if (file) {
    icon.value.image = file;
    imageError.value = '';
  }
};

// Watch for open and close of modal
watch(() => showAddbadgeDialog.value, async (open) => {
  if (!open) {
    icon.value.image = null;
    errorMessage.value = '';
    taskPrerequisites.value = [];
    experiencePrerequisites.value = [];
  }
  if(open){
    // Reset prerequisites and mode
    taskPrerequisites.value = [];
    experiencePrerequisites.value = [];

    if(badge.value.id && !badge.value.byCount) {
      try {
        const taskData = await badgeSpecificTaskService.getAllForBadgeId(badge.value.id);
        taskPrerequisites.value = taskData.data.map(specificTask => specificTask.taskId);
      } catch (err) {
        console.error('Error fetching badge-specific tasks:');
        taskPrerequisites.value = [];
      }

      try {
        const experienceData = await badgeSpecificExperienceService.getAllForBadgeId(badge.value.id);
        experiencePrerequisites.value = experienceData.data.map( experiencePrerequisite => experiencePrerequisite.experienceId);
      } catch (err) {
        console.error('Error fetching badge-specific experiences:');
        experiencePrerequisites.value = [];
      }
    }
  }
});
// On mount get Task/Experience data no need to refresh
onMounted(async () => {
  try {
    const tasksResponse = await taskServices.getAll();
    tasks.value = tasksResponse.data || [];
    console.log('Tasks fetched:', tasks.value);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    tasks.value = [];
  }
  try {
    const experiencesResponse = await experienceServices.getAll();
    experiences.value = experiencesResponse.data || [];
    console.log('Experiences fetched:', experiences.value);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    experiences.value = [];
  }
});
</script>

<template>
  <v-dialog v-model="showAddbadgeDialog" width="60vw" @update:modelValue="emit('badgeAdded')">
    <v-card>
      <v-card-title>Add Badge </v-card-title>
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
            <v-radio-group v-model="badge.byCount" row class="mt-4 mb-4">
              <v-radio label="By Count" :value="true" />
              <v-radio label="By Specific Tasks/Experiences" :value="false" />
            </v-radio-group>
            <v-divider class="mb-2"></v-divider>
            <!-- Count Mode -->
            <v-row v-if="badge.byCount" dense>
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
            <v-row v-if="!badge.byCount" dense>
              <v-col cols="2">
                <v-switch color="#004761" :label="badge.badgeSpecificTaskAND ? 'All' : 'Any'"
                  v-model="badge.badgeSpecificTaskAND" 
:false-value="false"
:true-value="true"
/>
              </v-col>
              <v-col cols="10">
                <v-select v-model="taskPrerequisites" :items="tasks" item-value="id" item-title="name" clearable
                  multiple chips label="Tasks" />
              </v-col>
              <v-col cols="12">
                <v-col cols="6" offset="6">
                <v-text-field v-model="badge.taskCount" label="# needed to complete" type="number" density="compact"
                  hide-details variant="outlined" v-if="!badge.badgeSpecificTaskAND"
 />
                </v-col>
              </v-col>
              <v-divider class="mb-2"></v-divider>
              <v-col cols="2">
                <v-switch color="#004761" :label="badge.badgeSpecificExperiencesAND ? 'All' : 'Any'"
                  v-model="badge.badgeSpecificExperiencesAND" 
:false-value="false"
:true-value="true"
/>
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
