<script setup>
import { ref, computed, onMounted } from "vue";
import EventService from "../services/eventServices";
import { VDateInput } from 'vuetify/labs/VDateInput'


const experienceTypeSearch = ref(null)
const typeSearch = ref(null)
const attendanceTypes = ref(["QR Code", "Sign in Sheet", "Faculty Check-in"]);
const experienceTypeList = ref(["Career Fair", "Lunch and Learn"])
const types = ref([])

const name = ref(null);
const description = ref(null);
const type = ref(null);
const startDate = ref(null);
const startTime = ref(null);
const endDate = ref(null);
const endTime = ref(null);
const attendanceType = ref(null);
const location = ref(null);
const completionType = ref(null);
const registrationType = ref(null);
const experienceTypes = ref([])

// Define props for the component
const props = defineProps({
    dialog: Boolean,
});

// Define emits for the component
const emit = defineEmits(["update:dialog", "save"]);

// Computed property to handle the dialog visibility
const dialogModel = computed({
    get: () => props.dialog,
    set: (value) => emit("update:dialog", value),
});


// Function to initialize the component state
const initialize = () => {

};

// Watch for changes in the selected user and re-initialize
// watch(() => props.selectedUser, (newUser) => {
//     if (newUser) {
//         initialize();
//     }
// });

// Call initialize when the component is mounted
onMounted(() => {
    initialize();
});

// Function to close the dialog
const closeDialog = () => {
    emit("update:dialog", false);
};

// Function to save the permissions
const save = () => {

    let startDateTime = new Date(`${startDate.value.toISOString().split("T")[0]}T${startTime.value}`)
    let endDateTime = new Date(`${endDate.value.toISOString().split("T")[0]}T${endTime.value}`)
    
    EventService.createEvent({
        "name": name.value,
        "desc": description.value,
        "startDateTime": startDateTime.toISOString(),
        "endDateTime": endDateTime.toISOString(),
        "location": location.value,
        "attendanceType": attendanceType.value,
        "completionType": completionType.value,
        "registrationType": registrationType.value,
        "semesterId": null,
        "badgeId": null
    })
    .then(() => {
        console.log("complete")
        emit("add")
    })
    .catch((res) => {
        console.log(`Error: ${res}`)
    })

    closeDialog();
};
</script>
<template>
    <v-dialog scrollable v-model="dialogModel" max-width="500px">
        <v-card>
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>New Event</span>
            </v-card-title>
            <v-card-text class="flex-grow-1 d-flex">
                <v-container>
                    <v-row><v-text-field v-model="name" label=Name*></v-text-field></v-row>
                    <v-row><v-text-field v-model="description" label="Description"></v-text-field></v-row>
                    <v-row>
                        <v-container class="pa-0">
                            <v-combobox
                            v-model="type"
                            v-model:search="typeSearch"
                            :hide-no-data="false"
                            :items="types"
                            label="Event Types"
                            hide-selected
                            multiple
                            closable-chips
                            chips
                            persistent-hint
                            >
                                <template v-slot:no-data>
                                    <v-list-item>
                                    <v-list-item-title>
                                        No results matching "<strong>{{ typeSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
                                    </v-list-item-title>
                                    </v-list-item>
                                </template>
                            </v-combobox>
                        </v-container>
                    </v-row>
                    <v-row><v-select v-model="attendanceType" label="Attendance Type*" :items=attendanceTypes></v-select></v-row>
                    <v-row>Date and Time</v-row>
                    <v-row><v-date-input v-model="startDate" label="Start Date"></v-date-input><v-text-field class="ml-2" v-model="startTime" placeholder="00:00 AM" label="Start Time"></v-text-field></v-row>
                    <v-row><v-date-input v-model="endDate" label="End Date"></v-date-input><v-text-field class="ml-2" v-model="endTime" placeholder="00:00 PM" label="End Time"></v-text-field></v-row>
                    <v-row><v-text-field v-model="location" label="Location*"></v-text-field></v-row>
                    <v-row>Completion Type*</v-row>
                    <v-row><v-radio-group v-model="completionType">
                        <v-radio label="Automatic" value="Automatic"></v-radio>
                        <v-radio label="Self-Reported" value="Self-Reported"></v-radio>
                        <v-radio label="OC Employee Approval" value="OC Employee Approval"></v-radio>
                    </v-radio-group></v-row>
                    <v-row>Registration Type*</v-row>
                    <v-row><v-radio-group v-model="registrationType">
                        <v-radio label="In-App" value="In-App"></v-radio>
                        <v-radio label="Handshake" value="Handshake"></v-radio>
                    </v-radio-group></v-row>

                    <v-row>
                        <v-container class="pa-0">
                            <v-combobox
                            v-model="experienceTypes"
                            v-model:search="experienceTypeSearch"
                            :hide-no-data="false"
                            :items="experienceTypeList"
                            label="Fulfilled Experience Types"
                            hide-selected
                            multiple
                            closable-chips
                            chips
                            persistent-hint
                            >
                                <template v-slot:no-data>
                                    <v-list-item>
                                    <v-list-item-title>
                                        No results matching "<strong>{{ experienceTypeSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
                                    </v-list-item-title>
                                    </v-list-item>
                                </template>
                            </v-combobox>
                        </v-container>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>



            <v-card-actions>
                <v-btn color="red darken-1" text @click="closeDialog()">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>