<script setup>
import { ref, onMounted, computed } from 'vue';
import badgeService from '../services/badgeServices';
import iconServices from '../services/iconServices.js';
import userBadgesServices from '../services/userBadgesServices';
import studentInfoServices from '../services/studentInfoServices';
import Utils from '../config/utils.js';

const badges = ref([]);

const badgeChunks = computed(() => {
  const chunkSize = 5;
  const chunks = [];
  for (let i = 0; i < badges.value.length; i += chunkSize) {
    chunks.push(badges.value.slice(i, i + chunkSize));
  }
  return chunks;
});

onMounted(async () => {
  try {
    const studentId = (
      await studentInfoServices.getStudentInfoById(Utils.getStore('user').id).catch(() => null)
    )?.data?.[0]?.id;

    let earnedBadges = (await userBadgesServices.getByStudentId(studentId).catch(() => null))?.data || [];
    earnedBadges = earnedBadges.map((badge) => badge.badgeId);

    badges.value = (await badgeService.getAllBadges()).data;

    for (const badge of badges.value) {
      badge.earned = earnedBadges.includes(badge.id);
      try {
        badge.image = badge.image
          ? (await iconServices.getIconByFile(badge.image)).data
          : null;
      } catch (error) {
        console.error('Error fetching badge image:', error.message);
        badge.image = null;
      }
    }
  } catch (error) {
    console.error('Error fetching badges:', error.message);
  }
});
</script>

<template>
  <v-container class="pt-10">
    <v-row justify="center" class="mb-6">
      <v-col cols="12" class="text-center">
        <h1 class="text-h4 font-weight-bold">Flight Plan Badges</h1>
      </v-col>
    </v-row>

    <v-card height="80vh" width="90vw" elevation="24" class="mx-auto scroll pa-6 rounded-xl primary">
      <v-row
        v-for="(chunk, chunkIndex) in badgeChunks"
        :key="'chunk-' + chunkIndex"
        dense
        class="py-10 px-4"
      >
        <v-col cols="1" />

        <v-col
          v-for="(badge, index) in chunk"
          :key="badge.name"
          cols="2"
          class="d-flex flex-column align-center"
          :style="index % 2 === 1 ? 'position: relative; top: 20vh;' : 'position: relative;'"
        >
          <v-avatar
            size="12vw"
            :class="badge.earned ? 'accent' : 'secondary'"
            class="overflow-hidden"
          >
            <v-img
              v-if="badge.image"
              :src="`data:image/*;base64,${badge.image}`"
              width="80%"
              height="80%"
              class="badge_image mx-4 my-4"
            />
          </v-avatar>

          <v-card class="mt-2 px-4 py-1 text-center secondary" rounded="lg" elevation="0">
            <span>{{ badge.name }}</span>
          </v-card>
        </v-col>

        <v-col cols="1" />
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped>
.badge_image {
  object-fit: contain;
}
.scroll {
  overflow-y: auto;
}
</style>
