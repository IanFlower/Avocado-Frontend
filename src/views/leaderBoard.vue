<template>
  <v-container>
      <v-card-title class="text-h1 text-center">
        Top Point Leaders
      </v-card-title>
      <v-card-text>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="5" md="5" class="pa-6 ma-6">
            <v-card outlined class="bg-secondary">
              <v-row>
                <v-col cols="2">
                  <v-card class="bg-primary fill-height pa-4 text-center">
                    <span class="text-h2">1</span>
                  </v-card>
                </v-col>

                <v-col cols="2">
                  <v-avatar size="150">
                    Profile Picture
                  </v-avatar>
                </v-col>
                <v-col>
                  <v-card-title class="text-h3 font-weight-bold">Ian Fowler</v-card-title>
                  <v-card-text>
                    Major
                    <v-spacer></v-spacer>
                    <p>points</p>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const user = ref(null);


const getStudents = () => {
  
};
</script>

<style scoped>
</style>
