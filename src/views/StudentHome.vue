<template>
  <v-container>
    <!-- Upcoming Events-->
    <v-row>
      <v-col md="2">
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

      <!-- Title with Dropdown Menu -->
      <v-col cols="6">
        <v-row class="justify-center align-center">
          <v-card class="pa-4 d-flex align-center" elevation="0" style="background: none; box-shadow: none;">
            <v-card-title class="text-h4 font-weight-bold" style="margin-right: 8px;">
              Spring {{ selectedYear }}
            </v-card-title>

            <v-menu offset-y transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="32" style="cursor: pointer;">
                  mdi-chevron-down
                </v-icon>
              </template>

              <v-card elevation="3">
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

        <!-- Tasks -->
        <h2 class="text-center">Tasks</h2>
        <v-row>
          <v-col cols="12" v-for="n in 5" :key="n">
            <v-btn class="pa-2 mb-2 d-flex align-center pl-4" width="1000" height="50" elevation="2" shaped
              style="border-radius: 50px; justify-content: flex-start; text-align: left; font-weight: normal; background-color: #D5DFE7; color: black;"
              @click="handleTaskClick(n)">
              Task Placeholder
            </v-btn>
          </v-col>
        </v-row>

        <!-- Experiences -->
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
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      selectedYear: 2025,
      availableYears: [2025, 2026, 2027],
    };
  },
  methods: {
    selectYear(year) {
      this.selectedYear = year;
    }
  }
};

</script>