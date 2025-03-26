<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Utils from '../config/utils';
// Helper Refs
const search = ref('');
const item = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
</script>

<template>
  <v-container fluid class="mt-3" style="overflow: hidden">
    <v-row align="center" justify="center">
      <v-col cols="6" offset-md="3" align="center">
        <h1>Student Shop</h1>
      </v-col>
      <v-col cols="3" class="d-flex justify-center">
        <v-btn class="text-center disable-events accent clickable-card py-8 px-13 d-flex align-center justify-center"
          elevation="6" size="x-large">
          <div class="d-flex flex-column align-center">
            <span class="font-weight-bold">Points:</span>
            <span class="text-h6">{{ selectedStudentPoints ? selectedStudentPoints : 0 }}</span>
          </div>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" offset="4">
        <v-text-field prepend-inner-icon="mdi-magnify" v-model="search" label="Search" clearable single-line
          hide-details variant="outlined" rounded="lg" density="compact"></v-text-field>
      </v-col>
    </v-row>
    <v-row style="overflow-y: auto; max-height: 70vh;">
      <v-col cols="10" offset="1">
        <v-row>
          <v-col cols="3" v-for="item in 12" :key="item">
            <v-card height="35vh" width="15vw" class="secondary">
              <v-img src="https://cdn.vuetifyjs.com/images/cards/sun.png"  cover crop height="28vh" width="15vw"></v-img>
              <v-spacer></v-spacer>
              <v-card-actions >
                <v-row height="7vh" class="align-center">
                  <v-col cols="8">
                    <span class="text-h6">{{ item }}</span>
                  </v-col>
                  <v-col cols="4">
                    <v-btn :icon="`mdi-numeric-${100}`" width="2.8vw" height="2.8vw" class="accent-button">
                      100
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.disable-events {
  pointer-events: none
}

h1 {
  font-size: 4rem;
}
</style>