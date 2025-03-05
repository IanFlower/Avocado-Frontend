<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import badgeServices from '../services/badgeServices';


const props = defineProps({
  badgeId: Number,
});

const emit = defineEmits(['badgeUpdated', 'close']);

const name = ref('');
const desc = ref('');
const requiredPoints = ref(0);

// Fetch badge from API
const fetchbadge = async () => {
  if (props.badgeId) {
    try {
      const response = await badgeServices.getbadgeById(props.badgeId);
      const badge = response.data;
      name.value = badge.name;
      desc.value = badge.desc;
      requiredPoints.value = badge.requiredPoints;
    } catch (error) {
      console.error('Error fetching badge:', error);
    }
  }
};

onMounted(fetchbadge);


const updatebadge = async () => {
  console.log('Update button clicked');
  
  const badge = {
    id: props.badgeId, 
    name: name.value,
    desc: desc.value,
    image: image.value,
  };

  console.log("Updating badge with:", badge);

  try {
    const response = await badgeServices.updatebadge(badge); 
    console.log("API Response after update:", response.data);

    emit('badgeUpdated');
    emit('close'); 
  } catch (error) {
    console.error('Error updating badge:', error);
  }
};

</script>

<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-form @submit.prevent="updatebadge">
          <v-text-field v-model="name" label="Name" required></v-text-field>
          <v-textarea v-model="desc" label="Description" required></v-textarea>
          <v-text-field v-model.number="requiredPoints" label="Points" type="number" required></v-text-field>
          <v-btn type="button" color="primary" class="mt-3" @click="updatebadge">Save</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
