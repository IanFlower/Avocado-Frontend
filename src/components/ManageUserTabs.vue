<template>
    <v-spacer></v-spacer>
    <div class="pa-12" style="padding-top:12px">
      <v-btn class="secondary"size="x-large":class="{ 'active-button': selectedButton === 'Students' }"@click="toggleActive('Students')">
        Students
      </v-btn>
      <v-btn class="secondary"size="x-large":class="{ 'active-button': selectedButton === 'Professors' }"@click="toggleActive('Professors')">
        Professors
      </v-btn>
      <v-btn class="secondary" size="x-large":class="{ 'active-button': selectedButton === 'Student Workers' }"@click="toggleActive('Student Workers')">
        Student Workers
      </v-btn>
      <v-btn class="secondary"size="x-large":class="{ 'active-button': selectedButton === 'Admins' }"@click="toggleActive('Admins')">
        Admins
      </v-btn>
      <v-divider></v-divider>
      <v-spacer></v-spacer>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedButton: null,
      };
    },
    methods: {
      toggleActive(button) {
        this.selectedButton = button;
        
      },
    },
  };
  </script>
  
  <style scoped>
  .v-btn {
    border-radius: 40px 40px 0 0;
  }
  .active-button {
    background-color: #1976d2 !important;
    color: white !important;
  }
  </style>
  