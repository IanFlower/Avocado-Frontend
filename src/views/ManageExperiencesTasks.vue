<script setup>
import { ref, onMounted, computed } from 'vue';
import experienceService from '../services/experiencesServices';
import taskService from '../services/tasksServices';
import TableOverLay from '../components/TableOverLay.vue';
const required = (label) => (value) => !!value || `The ${label} field is required.`;
// Helper refs
const addItemForm = ref(null)
const tableOverLayRefs = ref({
    selectedSemester: false,
    search: '',
    dialogAdd: false,
    dialogDelete: false,
    type: 'Experience',
    item: { dataType: null, data: null }
})
//Constants
const semesters = [
    1, 2, 3, 4, 5, 6, 7, 8]
const cliftonStrengths = [
    "Self Awareness", "Self Regulation", "Self Motivation", "Achievement Orientation", "Responsibility", "Kindness", "Humility"
]
const majors = [
    "Computer Science", "Business", "Engineering", "Arts", "Education", "Health Science", "Environment", "Social Science", "Other"
]
const eventTypes = [
    "Workshop", "Seminar", "Conference", "Internship", "Volunteer", "Other"
]
// Data
const experiencesTasksData = ref([]);
const tableData = computed(() => experiencesTasksData.value.filter(item => item.data.semestersFromGraduation == tableOverLayRefs.value.selectedSemester + 1));
const headers = [
    { title: 'Scheduling Type', align: 'left', key: 'dataType' },
    { title: 'Name', align: 'left', key: 'data.name' },
    { title: 'Description', align: 'left', key: 'data.desc' },
    { title: 'Points', align: 'left', key: 'data.points' },
    { title: 'Type', align: 'left', key: 'data.type' },
    { title: 'Reflection Required', align: 'left', key: 'data.reflectionRequired' },
    { title: 'Action', align: 'left', key: 'action' }
]
async function editSaveItem() {
    const { valid } = await addItemForm.value.validate();
    if (!valid) return;
    switch (tableOverLayRefs.value.item.dataType) {
        case dataType == "Task":
            if (tableOverLayRefs.value.item.data.id == 0) {
                taskService.createTask(tableOverLayRefs.value.item.data).then(
                    (res) => {
                        experiencesTasksData.value.push(res.data)
                    }
                ).catch(() => {
                    console.log("An error occurred adding task");
                });
            }
            else {
                taskService.updateTask(tableOverLayRefs.value.item.data).then(
                    (res) => {
                        experiencesTasksData.value.find(item => tableOverLayRefs.value.item.data.id == tableOverLayRefs.value.item.id && item.dataType == tableOverLayRefs.value.item.dataType).data = res.data
                    }
                ).catch(() => {
                    console.log("An error occurred updating task");
                });
            }
            break;
        case dataType == "Experience":
            if (tableOverLayRefs.value.item.data.id == 0) {
                experienceService.createExperience(tableOverLayRefs.value.item.data).then(
                    (res) => {
                        experiencesTasksData.value.push(res.data)
                    }
                ).catch(() => {
                    console.log("An error occurred adding experience");
                });
            }
            else {
                experienceService.updateExperience(tableOverLayRefs.value.item.data).then(
                    (res) => {
                        experiencesTasksData.value.find(item => tableOverLayRefs.value.item.data.id == tableOverLayRefs.value.item.id && item.dataType == tableOverLayRefs.value.item.dataType).data = res.data
                    }
                ).catch(() => {
                    console.log("An error occurred updating experience");
                });
            }
            break;
    }
    tableOverLayRefs.value.dialogAdd = false
}
function deleteItem() {
    switch (tableOverLayRefs.value.item.dataType) {
        case dataType == "Task":
            taskService.deleteTask(tableOverLayRefs.value.item.data.id).then(() => {
                experiencesTasksData.value = experiencesTasksData.value.filter(item => item.dataType != tableOverLayRefs.value.item)
            }).catch(() => {
                console.log("An error occurred deleting task");
            });
            break;
        case dataType == "Experience":
            experienceService.deleteExperience(tableOverLayRefs.value.item.data.id).then(() => {
                experiencesTasksData.value = experiencesTasksData.value.filter(item => item != tableOverLayRefs.value.item)
            }).catch(() => {
                console.log("An error occurred deleting experience");
            });
            break;
    }
    tableOverLayRefs.value.dialogDelete = false
}
onMounted(() => {
    experienceService.getAllExperiences().then((data) => {
        data.data.forEach((item) => {
            experiencesTasksData.value.push({
                dataType: "Experience",
                data: item,
                experienceEventType: [],
                majors: [],
                cliftonStrengths: []
            })
        })
    }).catch(() => {
        console.log("An error occurred fetching experiences");
    })
    taskService.getAllTasks().then((data) => {
        data.data.forEach((item) => {
            experiencesTasksData.value.push({
                dataType: "Task",
                data: item,
                majors: [],
                cliftonStrengths: []
            })
        })
    }).catch(() => {
        console.log("An error occurred fetching tasks");
    })
})
</script>
<template>
    <v-container>
        <!-- Table with actions -->
        <v-row align="center" justify="center">
            <v-col cols="11">
                <v-data-table :headers="headers" :items="tableData" :search="tableOverLayRefs.search">
                    <template v-slot:top>
                        <v-toolbar color="white" v-if="tableOverLayRefs">
                            <TableOverLay v-model="tableOverLayRefs" />
                        </v-toolbar>
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                        <v-icon icon="mdi-pencil-box-outline" class="me-2" size="large"
                            @click="tableOverLayRefs.dialogAdd = true, tableOverLayRefs.item = Object.assign({}, item), console.log(item);"></v-icon>
                        <v-icon icon="mdi-trash-can-outline" color="red" size="large"
                            @click="tableOverLayRefs.dialogDelete = true, tableOverLayRefs.item = item"></v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <!-- Modal for adding/editing new experience -->
        <v-dialog v-model="tableOverLayRefs.dialogAdd" max-width="500px">
            <v-card>
                <v-card-title> {{ tableOverLayRefs.item.data.id == 0 ? 'Add Task/Experience' : ` Edit ${tableOverLayRefs.item.dataType}` }}</v-card-title>
                <v-card-text>
                    <v-divider></v-divider>
                    <v-form ref="addItemForm">
                        <v-radio-group  v-if="tableOverLayRefs.item.data.id === 0" label="Scheduling Type*" :rules="[required('Scheduling Type')]"
                            v-model="tableOverLayRefs.item.dataType">
                            <v-radio label="Task" value="Task"></v-radio>
                            <v-radio label="Experience" value="Experience"></v-radio>
                        </v-radio-group> <!-- Scheduling Type-->
                        <v-text-field label="Name*" :rules="[required('Name')]"
                            v-model="tableOverLayRefs.item.data.name"></v-text-field> <!--  Name-->
                        <v-textarea label="Description*" :rules="[required('Description')]"
                            v-model="tableOverLayRefs.item.data.desc"></v-textarea> <!--  Description-->
                        <v-text-field label="Points*" :rules="[required('Points')]"
                            v-model="tableOverLayRefs.item.data.points"></v-text-field> <!--  Points-->
                        <v-text-field label="Type*" :rules="[required('Type')]"
                            v-model="tableOverLayRefs.item.data.type"></v-text-field> <!--  Type -->
                        <v-select label="Category*" :rules="[required('Category')]"
                            v-model="tableOverLayRefs.item.data.category"></v-select> <!--  Category -->
                        <v-select label="Semesters Till Graduation*" :rules="[required('Semesters Till Graduation')]"
                            v-model="tableOverLayRefs.item.data.semesterFromGraduation" :items="semesters"></v-select>
                        <!--  Semester Till graduation out of 8 -->
                        <v-checkbox label="Reflection Required"
                            v-model="tableOverLayRefs.item.data.reflectionRequired"></v-checkbox>
                        <!--  Reflection Required-->
                        <v-checkbox label="Document Required"
                            v-model="tableOverLayRefs.item.data.documentRequired"></v-checkbox>
                        <!--  Document Required-->
                        <v-select label="Clifton Strengths" multiple v-model="tableOverLayRefs.item.cliftonStrengths"
                            :items="cliftonStrengths" clearable chips></v-select>
                        <!--  Clifton Strengths-->
                        <v-select label="Majors" multiple v-model="tableOverLayRefs.item.majors" :items="majors"
                            clearable></v-select>
                        <!--  Majors-->
                        <v-select v-if="tableOverLayRefs.item.dataType == 'Experience'" label="Event Type"
                            v-model="tableOverLayRefs.item.experienceEventType" :items="eventTypes" multiple></v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn variant="text" style="align-self: left !important;"
                        @click="tableOverLayRefs.item = null; tableOverLayRefs.dialogAdd = false">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="alt-button" variant="text" style="align-self: right !important;"
                        @click="editSaveItem(tableOverLayRefs.item)">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Modal for confirming delete -->
        <v-dialog v-model="tableOverLayRefs.dialogDelete" max-width="500px" max-height="600px">
            <v-card>
                <v-card-title>Are you sure you want to delete this item?</v-card-title>
                <v-spacer></v-spacer>
                <v-card-text> You will not be able to recover this item! </v-card-text>
                <v-card-actions>
                    <v-btn class="secoundary-button" variant="text"
                        @click="tableOverLayRefs.dialogDelete = false">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="warning-button" variant="text" @click="deleteItem()">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
