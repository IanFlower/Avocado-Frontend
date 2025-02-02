<script setup> 
import logo from '../assets/OC_and_Career_Service_Logo.png'
</script>

<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters >
      <v-col cols="12" md="4">
        <v-card outline height="550px"class="d-flex justify-center align-center">
          <img height="200px" weidth="200px":src="logo" alt="OC and Career Service Logo">
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card outline height="550px" style="background-color: #811420;   text-align: center;"> 
            <v-card-title class="d-flex justify-center align-center" style="color: white;  font-size: 28px;">
                Welcome To OC's <br>Flight Plan
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-text style="color: white; font-size: 18px; margin-top: auto;padding-top:370px">
                "for I know the plans for you..."  <br>Jeremiah 9:11
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

