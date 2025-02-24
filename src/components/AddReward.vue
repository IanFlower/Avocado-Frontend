<template>
  <v-container>
    <v-form @submit.prevent="addReward" ref="form">
      <v-text-field v-model="reward.name" label="Reward Name" required />

      <v-textarea v-model="reward.desc" label="Description" required />

      <v-text-field v-model="reward.points" label="Points" type="number" required />

      <v-file-input label="Image Upload" accept="image/*" required @change="handleImageUpload" />

      <v-btn type="submit" color="primary">Save</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import rewardServices from '../services/rewardServices.js';

const reward = ref({
  name: '',
  desc: '',
  requiredPoints: '',
  image: null,
});

const emit = defineEmits(['rewardAdded']);

const handleImageUpload = (event) => {
  const file = event?.target?.files?.[0] || null;
  reward.value.image = file;
};

const addReward = async () => {
  rewardServices.addReward({
  "name": reward.value.name,
  "desc": reward.value.desc,
  "requiredPoints": reward.value.requiredPoints
})

  .then(() => {
    console.log("complete")
    emit("rewardAdded")
  })
  .catch((res)=> {
    console.log(`Error: ${res}`)
  })

}
</script>
