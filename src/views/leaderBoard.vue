<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" style="height: 100%" md="1">
        <!-- Sidebar content goes here -->
        <v-card style="height: 100%" class = "primary">
          <v-card-title>Leaderboard</v-card-title>
          <v-tabs v-model="tab" direction="vertical"> 
            <v-tab>Top 8</v-tab>
            <v-tab>Recent</v-tab>
            <v-tab>All Time</v-tab>
          </v-tabs>
        </v-card>
      </v-col>
      <v-col>
        <!-- Main content goes here -->
        <v-card height="100%">
          <v-card-text>
            <!-- Add your main content here -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref(0)
</script>

<style scoped>
.v-card {
  height: 100%;
}
</style>

