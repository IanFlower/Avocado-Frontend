
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import permissionServices from '../services/permissionServices';
import { VDateInput } from 'vuetify/labs/VDateInput'

const attendanceTypes = ["QR Code", "Sign in Sheet", "Faculty Check-in"]
const experienceTypeList = ["Career Fair", "Lunch and Learn"]
const experienceTypeSearch = ref(null)

const startDateTime = ref(VDateInput);
const endDateTime = ref(VDateInput);


// function removeSelection(index) {
//     this.model.splice(index, 1)
// };

// Define props for the component
const props = defineProps({
    dialog: Boolean,
    selectedUser: Object,
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
    if (props.selectedUser) {
        localPermission.value.userId = props.selectedUser.id;
        permissionServices.findByUser(props.selectedUser.id)
            .then(response => {
                if (response.data === null) {
                    localPermission.value.userId = props.selectedUser.id;
                }
                else {
                    localPermission.value = response.data;
                }
            })
            .catch(error => {
                console.error("Error fetching user permissions:", error);
            });
    }
};

// Watch for changes in the selected user and re-initialize
watch(() => props.selectedUser, (newUser) => {
    if (newUser) {
        initialize();
    }
});

// Call initialize when the component is mounted
onMounted(() => {
    initialize();
});

// Function to close the dialog
const closeDialog = () => {
    emit("update:dialog", false);
};

// Function to save the permissions
const saveDialog = () => {
    localPermission.value.userId = props.selectedUser.id;
    permissionServices.updateByUserId(localPermission.value.userId, localPermission.value)
        .then(response => {
            console.log(response.data);
            emit("save", localPermission.value);
            closeDialog();
        })
        .catch(error => {
            permissionServices.createPermission(localPermission.value)
                .then(response => {
                    console.log(response.data);
                    emit("save", localPermission.value);
                    closeDialog();
                })
                .catch(createError => {
                    console.error("Error creating user permissions:", createError);
                });
        });
};



const createEvent = () => {
    EventService.createEvent({
        "id": 1,
        "name": "",
        "desc": null,
        "startDateTime": null,
        "endDateTime": null,
        "type": "",
        "location": "",
        "attendanceType": "",
        "completionType": "",
        "registrationType": "",
        "createdAt": null,
        "updatedAt": null,
        "semesterId": null,
        "badgeId": null
    })
};
</script>

<style scoped>
.full-height {
    height: 100%;
}

.v-divider.full-height {
    height: 100%;
}
</style>

<template>
    <v-dialog scrollable v-model="dialogModel" max-width="500px">
        <v-card>
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>New Event</span>
            </v-card-title>
            <v-card-text class="flex-grow-1 d-flex">
                <v-container>
                    <v-row><v-text-field label=Name*></v-text-field></v-row>
                    <v-row><v-text-field label="Description"></v-text-field></v-row>
                    <v-row><v-text-field label="Type*"></v-text-field></v-row>
                    <v-row><v-select label="Attendance Type*" :items=attendanceTypes></v-select></v-row>
                    <v-row>Date and Time</v-row>
                    <v-row><v-date-input label="Start Date"></v-date-input></v-row>
                    <v-row><v-date-input label="End Date"></v-date-input></v-row>
                    <v-row><v-text-field label="Location*"></v-text-field></v-row>
                    <v-row>Completion Type*</v-row>
                    <v-row><v-radio-group>
                        <v-radio label="Automatic" value="Automatic"></v-radio>
                        <v-radio label="Self-Reported" value="Self-Reported"></v-radio>
                        <v-radio label="OC Employee Approval" value="OC Employee Approval"></v-radio>
                    </v-radio-group></v-row>
                    <v-row>Registration Type*</v-row>
                    <v-row><v-radio-group>
                        <v-radio label="In-App" value="In-App"></v-radio>
                        <v-radio label="Handshake" value="Handshake"></v-radio>
                    </v-radio-group></v-row>

                    <v-row>
                        <v-container fluid>
                            <v-combobox
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
                <v-btn color="red darken-1" text @click="closeDialog">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="saveDialog">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>