<template>
  <v-container>
    <!--Upcoming Events Placeholder-->
    <v-row>
      <v-col width="20%">
        <v-card class="d-flex flex-column pa-5" height="800px"
          style="background-color: #D5DFE7; color: black; text-align: center;">
          <v-card-title>Upcoming Events</v-card-title>

          <v-divider></v-divider>

          <v-spacer></v-spacer>

          <v-card-actions class="justify-center" style="background-color: #D5DFE7; color: black; font-size: 12px; ">
            <v-btn variant="plain" style="font-size: 11px; color: black;">
              view Calendar
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-col>

      <!-- Semester with Dropdown Menu -->
      <v-col width="60%">
        <v-row class="justify-center align-center">
          <v-card class="pa-3 d-flex align-center" elevation="0" style="background: none; box-shadow: none;">
            <v-card-title class="text-h4 font-weight-bold" style="margin-right: 8px;">
              Spring {{ selectedYear }}
            </v-card-title>

            <v-menu offset-y transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="32" style="cursor: pointer;">
                  mdi-chevron-down
                </v-icon>
              </template>

              <v-card elevation="8">
                <v-list>
                  <v-list-item v-for="year in availableYears" :key="year" @click="selectYear(year)">
                    <v-list-item-title class="text-h6 text-center">
                      {{ year }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-card>
        </v-row>

        <!-- Tasks placeholder box-->
        <h2 class="text-center">Tasks</h2>
        <v-row>
          <v-col md="12" cols="12" v-for="n in 5" :key="n">
            <v-btn class="pa-2 mb-2 d-flex align-center pl-4" width="1000" height="50" elevation="2" shaped
              style="border-radius: 50px; justify-content: flex-start; text-align: left; font-weight: normal; background-color: #D5DFE7; color: black;"
              @click="handleTaskClick(n)">
              Task Placeholder
            </v-btn>
          </v-col>
        </v-row>

        <!-- Experiences placeholder box -->
        <h2 class="text-center mt-5">Experiences</h2>
        <v-row>
          <v-col cols="12" v-for="n in 4" :key="n">
            <v-btn class="pa-2 mb-2 d-flex align-center pl-4" width="1000" height="50" elevation="2" shaped
              style="border-radius: 50px; justify-content: flex-start; text-align: left; font-weight: normal; background-color: #D5DFE7; color: black;"
              @click="handleExperienceClick(n)">
              Experience Placeholder
            </v-btn>
          </v-col>
        </v-row>
      </v-col>


      <v-col width="20%" >
        <!--points placeholder box-->
        <v-card class="d-flex flex-column pa-5 text-center my-5 align-center" width = "200px" color = "#F9C634"elevation ="16"> 

          <v-card-title> points: </v-card-title>
        </v-card>

        <!--Leaderboard placeholder box-->
      <v-card class="d-flex flex-column pa-5 text-center" height = "400px"  width = "400px" color = "#811420" elevation ="16">
        <v-card-title>Leaderboard</v-card-title>

        <v-divider></v-divider>
        
      </v-card>
    </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      selectedYear: 2025,
      availableYears: [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028],
    };
  },
  methods: {
    selectYear(year) {
      this.selectedYear = year;
    }
  }
};

</script>