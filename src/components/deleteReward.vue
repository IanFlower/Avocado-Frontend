<template>
  <v-dialog v-model="dialogVisibleInternal" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Are you sure you want to delete "{{ reward.name }}"?</span>
      </v-card-title>

      <v-card-actions>
        <v-btn color="green" @click="deleteReward">Yes</v-btn>
        <v-btn color="red" @click="closeModal">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import rewardServices from '../services/rewardServices';

const props = defineProps({
  reward: Object,
  dialogVisible: Boolean,
});

const emit = defineEmits(['rewardDeleted', 'update:dialogVisible']);

const dialogVisibleInternal = ref(false);

// Watch for prop change and update internal dialog visibility
watch(() => props.dialogVisible, (newVal) => {
  dialogVisibleInternal.value = newVal;
});

const closeModal = () => {
  emit('update:dialogVisible', false); // Hide the dialog in the parent
};

const deleteReward = async () => {
  try {
    await rewardServices.DeleteReward(props.reward.id);
    emit('rewardDeleted'); // Notify parent about the reward deletion
    closeModal(); // Close the dialog
  } catch (error) {
    console.error('Error deleting reward:', error);
  }
};
</script>
