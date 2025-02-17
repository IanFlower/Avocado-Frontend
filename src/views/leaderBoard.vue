<template>
    
<v-card class="d-flex flex-column pa-4 text-center primary" height="400px" width="70%" elevation="12">
    <v-card-title class="text-subtitle-1">Leaderboard</v-card-title>
    <v-divider></v-divider>

    <!-- Leaderboard buttons -->
    <v-btn v-for="n in 5" :key="n" class="mb-2" @click="goHome">
      Leaderboard Placeholder {{ n }}
    </v-btn>
  </v-card>
</template>

<script setup>

import { useRouter } from 'vue-router';

const router = useRouter();

  const goHome = () => {
    router.push('/home'); 
  };

</script>