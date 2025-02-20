<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h5">Student Shop</span>
              <v-btn color="primary" @click="editRewards">Edit Rewards</v-btn>
            </v-card-title>
            <v-text-field v-model="searchQuery" label="Search" outlined dense class="mx-4" />
            <v-data-table :headers="headers" :items="filteredStudents" :sort-by="['points']" :sort-desc="!sortAscending">
              <template v-slot:item.purchase="{ item }">
                <v-btn icon @click="goToRedeemPoints(item.id)">
                  <v-icon>mdi-cart</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>