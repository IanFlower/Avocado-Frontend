<template>
    <v-dialog v-model="dialogModel" max-width="1000px" @update:model-value="closeDialog">
        <v-card class="d-flex flex-column">
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>Edit permission - {{ selectedUser?.fullName }}</span>
            </v-card-title>
            <v-card-text class="flex-grow-1 d-flex">
                <v-container class="pa-0">
                    <v-row dense class="fill-height">
                        <v-col>
                            <p class="font-weight-bold" align="center">View Only Permissions</p>
                            <v-checkbox v-model="localPermission.readAttendance" label="View Attendance"
                                class="mb-0"></v-checkbox>
                            <v-checkbox v-model="localPermission.readStudentInfo" label="View Student Infos"
                                class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.readStrengths" label="View Strengths"
                                class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.readLogs" label="View Logs" class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.redeemReward" label="Redeem Rewards" class="mb-1"></v-checkbox>

                        </v-col>
                        <v-divider vertical class="full-height"></v-divider>

                        <v-col>                            
                            <p class="font-weight-bold" align="center">Add Only Permissions</p>
                            <v-checkbox v-model="localPermission.readAttendance" label="Add Attendance"
                                class="mb-0"></v-checkbox>
                            <v-checkbox v-model="localPermission.addExperience" label="Add Experience"
                                class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.addTask" label="Add Task" class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.addReward" label="Add Reward" class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.addBadge" label="Add Badge" class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.addNotification" label="Add Notification" class="mb-1"></v-checkbox>
                        </v-col>
                        <v-divider vertical class="full-height"></v-divider>
                        <v-col>
                            <p class="font-weight-bold" align="center">Delete Only Permissions</p>
                            <v-checkbox v-model="localPermission.removeExperience" label="Delete Experience"
                                class="mb-0"></v-checkbox>
                            <v-checkbox v-model="localPermission.removeTask" label="Delete Task" class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.removeBadge" label="Delete Badge" class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.removeReward" label="Delete Reward" class="mb-1"></v-checkbox>
                        </v-col>
                        <v-divider vertical class="full-height"></v-divider>
                        <v-col>
                            <p class="font-weight-bold" align="center">Full Permissions</p>
                            <v-checkbox v-model="localPermission.writeAttendance" label="Attendance" class="mb-1"
                                @change="toggleFullPermission('writeAttendance', $event)"></v-checkbox>
                            <v-checkbox v-model="localPermission.addExperience" label="Experience" class="mb-1"
                                @change="toggleFullPermission('addExperience', $event)"></v-checkbox> 
                            <v-checkbox v-model="localPermission.changeStudentInfo" label="Student Info" class="mb-1"
                                @change="toggleFullPermission('changeStudentInfo', $event)"></v-checkbox>
                            <v-checkbox v-model="localPermission.addReward" label="Reward" class="mb-1"
                                @change="toggleFullPermission('addReward', $event)"></v-checkbox>
                            <v-checkbox v-model="localPermission.addEvent" label="Event" class="mb-1"
                                @change="toggleFullPermission('addEvent', $event)"></v-checkbox>
                            <v-checkbox v-model="localPermission.addBadge" label="Badge" class="mb-1"
                                @change="toggleFullPermission('addBadge', $event)"></v-checkbox>
                            <v-checkbox v-model="localPermission.addNotification" label="Notification" class="mb-1"></v-checkbox>
                            <v-checkbox v-model="localPermission.changePermissions" label="Alter User Permissions"
                                class="mb-1"></v-checkbox>
                        </v-col>
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

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import permissionServices from '../services/permissionServices';

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

// Local state for permissions
const localPermission = ref({
    permissionsId: null,
    readAttendance: false,
    writeAttendance: false,
    addTask: false,
    removeTask: false,
    addExperience: false,
    removeExperience: false,
    changePermissions: false,
    readLogs: false,
    readStudentInfo: false,
    changeStudentInfo: false,
    addReward: false,
    removeReward: false,
    redeemReward: false,
    readStrengths: false,
    addEvent: false,
    changeEvent: false,
    removeEvent: false,
    addBadge: false,
    removeBadge: false,
    addNotification: false,
    userId: null,
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
    initialize();
});


// Call initialize when the component is mounted
onMounted(() => {
    initialize();
});

// Function to close the dialog
const closeDialog = () => {
    localPermission.value = {
        permissionsId: null,
        readAttendance: false,
        writeAttendance: false,
        addTask: false,
        removeTask: false,
        addExperience: false,
        removeExperience: false,
        changePermissions: false,
        readLogs: false,
        readStudentInfo: false,
        changeStudentInfo: false,
        addReward: false,
        removeReward: false,
        redeemReward: false,
        readStrengths: false,
        addEvent: false,
        changeEvent: false,
        removeEvent: false,
        addBadge: false,
        removeBadge: false,
        addNotification: false,
        userId: null,
    };
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

// Function to toggle full permissions
const toggleFullPermission = (permissionKey, event) => {
    const value = event.target.checked;
    localPermission.value[permissionKey] = value;
    if (permissionKey === 'writeAttendance') {
        localPermission.value.readAttendance = value;
    } else if (permissionKey === 'changeStudentInfo') {
        localPermission.value.readStudentInfo = value;
    } else if (permissionKey === 'addExperience') {
        localPermission.value.removeExperience = value;
    } else if (permissionKey === 'addTask') {
        localPermission.value.removeTask = value;
    } else if (permissionKey === 'addReward') {
        localPermission.value.removeReward = value;
        localPermission.value.redeemReward = value;
    } else if (permissionKey === 'addEvent') {
        localPermission.value.addEvent = value;
        localPermission.value.changeEvent = value;
        localPermission.value.removeEvent = value;
    } else if (permissionKey === 'addBadge') {
        localPermission.value.removeBadge = value;
        localPermission.value.addBadge = value;
    }

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