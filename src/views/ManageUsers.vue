<script setup>
  import ManageUserTabs from '../components/ManageUserTabs.vue';

</script>

<template>
    <main>
      <v-container fluid class="no-padding">
        <ManageUserTabs/>
        <v-row class="pa-4">
          <!-- Toolbar Section ------------------ -->
          <v-col cols="12" class="pa-4">
            <v-toolbar flat color="#F7F6FE" >
              <v-toolbar-title style="margin-left: 20px;"><b>Students List</b></v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              
              <div style="width:30%">
                <!-- Search bar to filter students -->
                <v-text-field
                  v-model="search"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  single-line    
                ></v-text-field>
              </div>
              <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
          </v-col>
        </v-row>
  
        <v-row class="no-padding">
            <v-col cols="12" class="pa-4"> <!-- Added padding -->
                <v-card class="pa-4"> <!-- Added padding around the table -->
                <v-data-table
                    :headers="headers"
                    :items="students"
                    :search="search"
                    :sort-by="[{ key: 'studentName', order: 'asc' }]"
                >
            <!-- Editable student name field -->
            <template v-slot:item.studentName="{ item }">
            <v-text-field
                v-model="item.studentName"
                label="Student Name"
                @blur="updateStudent(item)"
                @keyup.enter="updateStudent(item)"
                single-line
                hide-details
                class="edit-field"
                autofocus
            />
            </template>

            <!-- Editable student age field -->
            <template v-slot:item.age="{ item }">
            <v-text-field
                v-model="item.age"
                label="Age"
                @blur="updateStudent(item)"
                @keyup.enter="updateStudent(item)"
                single-line
                hide-details
                class="edit-field"
            />
            </template>

            <!-- Editable student major field -->
            <template v-slot:item.major="{ item }">
            <v-text-field
                v-model="item.major"
                label="Major"
                @blur="updateStudent(item)"
                @keyup.enter="updateStudent(item)"
                single-line
                hide-details
                class="edit-field"
            />
            </template>

            <!-- Actions Column with View and Delete -->
            <template v-slot:item.actions="{ item }">
            <v-icon icon="mdi-eye" color="#624DE3" class="me-2" size="small" @click="viewItem(item)">
                mdi-eye
            </v-icon>
            <v-icon size="small" color="#A30D11" @click="deleteItem(item)">
                mdi-delete
            </v-icon>
            </template>
        </v-data-table>
                </v-card>
            </v-col>
        </v-row>

      </v-container>
  
      <!-- Snackbar for user notifications -->
      <v-snackbar v-model="snackbar" :color="snackbarColor" top right timeout="3000">
        {{ snackbarMessage }}
      </v-snackbar>
    </main>
  </template>
  
  <script>
  import ManageUserTabs from '../components/ManageUserTabs.vue';
  export default {
    components:{
        ManageUserTabs
    },
    data: () => ({
      search: '', // Search query input
      snackbar: false, // Controls snackbar visibility
      snackbarMessage: '', // Message displayed in snackbar
      snackbarColor: '', // Snackbar color (success/error)
      headers: [ // Table headers
        { title: 'Student Name', key: 'studentName' },
        { title: 'Age', key: 'age' },
        { title: 'Major', key: 'major' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      students: [], // List of students
      selectedStudent: null, // Currently selected student
    }),
  
    mounted() {
      this.initialize(); // Fetch students when the component mounts
    },
  
    methods: {
      // Fetch student data from the backend
      initialize() {
        // TODO: Implement function to fetch student data from API
      },
  
      // Display a snackbar notification
      showSnackbar(message, color) {
        this.snackbarMessage = message;
        this.snackbarColor = color === 'success' ? 'green' : 'red';
        this.snackbar = true;
      },
  
      // Update student information in the backend
      updateStudent(item) {
        // TODO: Implement function to update student data via API
      },
  
      // View student details
      viewItem(item) {
        this.selectedStudent = item;
        this.showSnackbar(`Viewing: ${item.studentName}`, 'success');
      },
  
      // Delete a student from the list and backend
      deleteItem(item) {
        // TODO: Implement function to delete student data via API
      },
  
      // Return to student list view
      goBack() {
        this.selectedStudent = null;
      }
    }
  };
  </script>