<template>
  <v-card>
  <v-container>
    <v-form ref="badgeForm">
      <v-text-field v-model="badge.name" label="Name" required></v-text-field>
      <v-textarea v-model="badge.desc" label="Description" required></v-textarea>

            <!-- Display current image if it exists -->
            <v-img 
        v-if="badge.image" 
        :src="badge.image" 
        max-width="200" 
        class="mt-3"
        alt="badge Image"
      ></v-img>

      <v-file-upload 
        v-if="!badge.image || badge.image instanceof File"
        label="Upload Image" 
        @change="handleImageUpload" 
        accept="image/*" 
        class="mt-3"
      ></v-file-upload>

      <v-card-actions>
        <v-btn @click="emit('badgeUpdated')" text color="secondary-button">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="updateBadge" text color="blue darken-1">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</v-card>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import badgeServices from "../services/badgeServices.js";
import iconServices from '../services/iconServices.js';
import { VFileUpload } from 'vuetify/labs/VFileUpload';

const props = defineProps({
  badgeId: Number,
});

const emit = defineEmits(["badgeUpdated", "close"]);

const badge = ref({
  name: "",
  desc: "",
});

// Fetch badge data from API
const fetchbadge = async () => {
  if (props.badgeId) {
    try {
      console.log("Fetching badge with ID:", props.badgeId);
      const response = await badgeServices.getbadgeById(props.badgeId);
      console.log("Badge data response:", response.data);

      if (response.data) {
        badge.value = {
          name: response.data.name || "",
          desc: response.data.desc || "",
        };

        if (badgeData.iconId) {
        const iconResponse = await iconServices.getIconById(badgeData.iconId);
        
        
          if (iconResponse.data && iconResponse.data.image) {
            badge.value.image = iconResponse.data.image; 
          }
        }
      }
    }
    catch (error) {
      console.error('Error fetching badge:', error);
    }
  }
};


onMounted(fetchbadge);


const updateBadge = async () => {
  try {
    console.log("Updating badge:", badge.value);
    
    const updatedbadge = {
      id: props.badgeId,
      name: badge.value.name,
      desc: badge.value.desc,
    };

    const response = await badgeServices.updateBadge(updatedbadge);
    console.log("Badge updated successfully:", response);

    emit("badgeUpdated");
    emit("close");
  } catch (error) {
    console.error("Error updating badge:", error);
  }
};

function handleImageUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) {
    console.error('No files selected');
    return;
  }

  const selectedImage = files[0];
  badge.value.image = selectedImage;
  console.log('Selected file:', badge.value.image);
}
</script>