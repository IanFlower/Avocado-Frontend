<script setup>
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import experienceService from '../services/experiencesServices';
import taskService from '../services/tasksServices';
import categoryService from '../services/categoryServices';
import cliftonStrengthService from '../services/cliftonStrengthServices';
import experienceEventTypeService from '../services/experienceEventTypeService';
import TypeService from '../services/typeServices';
import majorService from '../services/majors.Services';
import TableOverLay from '../components/TableOverLay.vue';
import experienceMajorService from '../services/experienceMajorServices';
import taskMajorService from '../services/taskMajorServices';
import taskStrengthService from '../services/taskStrengthService';
import experienceStrengthService from '../services/experienceStrengthService';
import { authorizeRoute , authorizeUser , ENUM} from '../auth/routeAuth';

// Valication
const required = (label) => (value) => !!value || `The ${label} field is required.`;
// Service const used for dynamic saving
const saveExperienceTaskService = { Task: taskService, Experience: experienceService }
// Helper refs
const addItemForm = ref(null)
const tableOverLayRefs = ref([{
    selectedSemester: 0,
    search: '',
    dialogAdd: false,
    dialogDelete: false,
    type: 'Experience',
    item: { dataType: null, data: null, experienceEventType: [], majors: [], cliftonStrengths: [] }
}])
// Constants
const semesters = [
    1, 2, 3, 4, 5, 6, 7, 8]

const categories = ref([])
const cliftonStrengths = ref([])
const majors = ref([])

const types = ref([])
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
// Save function for editing or creating
async function editSaveItem() {
    const { valid } = await addItemForm.value.validate();
    if (!valid) return;
    if (tableOverLayRefs.value.item.data.id == 0) {
        await saveExperienceTaskService[tableOverLayRefs.value.item.dataType].create(tableOverLayRefs.value.item.data).then(
            (data) => {
                tableOverLayRefs.value.item.data.id = data.data.id
                experiencesTasksData.value.push(JSON.parse(JSON.stringify(tableOverLayRefs.value.item)))
            }
        ).catch((error) => {
            console.log(`An error occurred adding ${tableOverLayRefs.value.item.dataType}`);
        });
    }
    else {
        saveExperienceTaskService[tableOverLayRefs.value.item.dataType].update(tableOverLayRefs.value.item.data.id, tableOverLayRefs.value.item.data).then(
            () => {
                const index = experiencesTasksData.value.findIndex((element) => element.data.id == tableOverLayRefs.value.item.data.id && element.dataType == tableOverLayRefs.value.item.dataType)
                experiencesTasksData.value[index] = JSON.parse(JSON.stringify(tableOverLayRefs.value.item))
            }
        ).catch((error) => {
            console.log(`An error occurred updating ${tableOverLayRefs.value.item.dataType}`);
        });
    }
    if (tableOverLayRefs.value.item.dataType == "Experience") {
        // Delete existing bridge table records for experienceId
        await experienceEventTypeService.delete(tableOverLayRefs.value.item.data.id).catch((error) => {
            console.log("An error occurred deleting experience event type");
        })
        // Create new bridge table records for experienceId and types
        tableOverLayRefs.value.item.experienceEventType.forEach((item) => {
            experienceEventTypeService.create({ experienceId: tableOverLayRefs.value.item.data.id, eventTypeId: item }).catch((error) => {
                console.log("An error occurred creating experience event type");
            })
        })
        // Delete existing bridge table records for experienceId
        await experienceMajorService.delete(tableOverLayRefs.value.item.data.id).catch((error) => {
            console.log("An error occurred deleting experience major");
        })
        // Create new bridge table records for experienceId and majors
        tableOverLayRefs.value.item.majors.forEach((item) => {
            experienceMajorService.create({ experienceId: tableOverLayRefs.value.item.data.id, majorId: item }).catch((error) => {
                console.log("An error occurred creating experience major");
            })
        })
        // Delete existing bridge table records for experienceId
        await experienceStrengthService.delete(tableOverLayRefs.value.item.data.id).catch((error) => {
            console.log("An error occurred deleting experience strength");
        })
        // Create new bridge table records for experienceId and majors
        tableOverLayRefs.value.item.cliftonStrengths.forEach((item) => {
            experienceStrengthService.create({ experienceId: tableOverLayRefs.value.item.data.id, strengthId: item }).catch((error) => {
                console.log("An error occurred creating experience strength");
            })
        })
    }
    else if (tableOverLayRefs.value.item.dataType == "Task") {
        // Delete existing bridge table records for experienceId
        await taskMajorService.delete(tableOverLayRefs.value.item.data.id).catch((error) => {
            console.log("An error occurred deleting task major");
        })
        // Create new bridge table records for experienceId and majors
        tableOverLayRefs.value.item.majors.forEach((item) => {
            taskMajorService.create({ taskId: tableOverLayRefs.value.item.data.id, majorId: item }).catch((error) => {
                console.log("An error occurred creating task major");
            })
        })
        // Delete existing bridge table records for experienceId
        await taskStrengthService.delete(tableOverLayRefs.value.item.data.id).catch((error) => {
            console.log("An error occurred deleting task strength");
        })
        // Create new bridge table records for experienceId and Strengths
        tableOverLayRefs.value.item.cliftonStrengths.forEach((item) => {
            taskStrengthService.create({ taskId: tableOverLayRefs.value.item.data.id, strengthId: item }).catch((error) => {
                console.log("An error occurred creating task strength");
            })
        })
    }

    // Close dialog
    tableOverLayRefs.value.dialogAdd = false
}
// Delete function
function deleteItem() {
    saveExperienceTaskService[tableOverLayRefs.value.item.dataType].delete(tableOverLayRefs.value.item.data.id).then(() => {
        experiencesTasksData.value.splice(experiencesTasksData.value.indexOf(tableOverLayRefs.value.item), 1)
    }).catch((error) => {
        console.log(`An error occurred deleting ${tableOverLayRefs.value.item.dataType}: ${error}`);
    });
    tableOverLayRefs.value.dialogDelete = false
}
// Authorize before mounting
onBeforeMount(async () => {
    await authorizeUser()
})
// Loading data upon mounting
onMounted(async () => {
    // Set default semester
    tableOverLayRefs.value.selectedSemester = 0
    // Get Prerequisite data for selects
    categoryService.getAllCategories().then((data) => {
        categories.value = data.data
    }).catch((error) => { console.log("An error occurred fetching categories") })
    cliftonStrengthService.getAllCliftonStrengths().then((data) => {
        cliftonStrengths.value = data.data
    }).catch((error) => { console.log("An error occurred fetching clifton strengths") })
    majorService.getAllMajors().then((data) => {
        majors.value = data.data
    }).catch((error) => { console.log("An error occurred fetching majors") })
    TypeService.getAllTypes().then((data) => {
        types.value = data.data
    }).catch((error) => { console.log("An error occurred fetching types") })
    // Load experiences and tasks
    await experienceService.getAll().then((data) => {
        data.data.forEach(async (item) => {
            let arrEventTypes = []
            let arrMajors = []
            let arrStrengths = []
            // Get Event Types
            await experienceEventTypeService.getAllForExperienceId(item.id).then((d) => {
                arrEventTypes = d.data.map((item) => { return item.eventTypeId })
            }).catch((error) => {
                console.log("An error occurred fetching experience event types");
            })
            // Get Majors
            await experienceMajorService.getAllForExperienceId(item.id).then((d) => {
                arrMajors = d.data.map((item) => { return item.majorId })
            }).catch((error) => {
                console.log("An error occurred fetching experience majors");
            })
            // Get Strengths
            await experienceStrengthService.getAllForExperienceId(item.id).then((d) => {
                arrStrengths = d.data.map((item) => { return item.strengthId })
            }).catch((error) => {
                console.log("An error occurred fetching experience strengths");
            })
            experiencesTasksData.value.push({
                dataType: "Experience",
                data: item,
                experienceEventType: arrEventTypes,
                majors: arrMajors,
                cliftonStrengths: arrStrengths
            })
        })
    }).catch((error) => {
        console.log("An error occurred fetching experiences");
    })
    await taskService.getAll().then((data) => {
        data.data.forEach(async (item) => {
            let arrMajors = []
            let arrStrengths = []
            // Get majors
            await taskMajorService.getAllForTaskId(item.id).then((d) => {
                arrMajors = d.data.map((item) => { return item.majorId })
            }).catch((error) => {
                console.log("An error occurred fetching task majors");
            })
            // Get strengths 
            await taskStrengthService.getAllForTaskId(item.id).then((d) => {
                arrStrengths = d.data.map((item) => { return item.strengthId })
            }).catch((error) => {
                console.log("An error occurred fetching task strengths");
            })
            experiencesTasksData.value.push({
                dataType: "Task",
                data: item,
                majors: arrMajors,
                cliftonStrengths: arrStrengths
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
            <v-col cols="11" class="my-12">
                <h1>Manage Experiences and Tasks</h1>
            </v-col>
        </v-row>
        <v-row align="center" justify="center">
            <v-col cols="11">
                <v-row no-gutters>
                    <TableOverLay v-model="tableOverLayRefs" />
                </v-row>
                <v-row>
                    <v-data-table :headers="headers" :items="tableData" :search="tableOverLayRefs.search">
                        <template v-slot:[`item.action`]="{ item }">
                            <v-icon icon="mdi-pencil-box-outline" class="me-2" size="large"
                                @click="tableOverLayRefs.dialogAdd = true, tableOverLayRefs.item = JSON.parse(JSON.stringify(item));"></v-icon>
                            <v-icon icon="mdi-trash-can-outline" color="red" size="large"
                                @click="tableOverLayRefs.dialogDelete = true, tableOverLayRefs.item = item"></v-icon>
                        </template>
                    </v-data-table>
                </v-row>
            </v-col>
        </v-row>
        <!-- Modal for adding/editing new experience -->
        <v-dialog v-model="tableOverLayRefs.dialogAdd" max-width="500px">
            <v-card>
                <v-card-title> {{ tableOverLayRefs.item.data.id == 0 ? 'Add Task/Experience' : ` Edit
                    ${tableOverLayRefs.item.dataType}` }}</v-card-title>
                <v-card-text>
                    <v-divider></v-divider>
                    <v-form ref="addItemForm">
                        <v-radio-group v-if="tableOverLayRefs.item.data.id === 0" label="Scheduling Type*"
                            :rules="[required('Scheduling Type')]" v-model="tableOverLayRefs.item.dataType">
                            <v-radio label="Task" value="Task"></v-radio>
                            <v-radio label="Experience" value="Experience"></v-radio>
                        </v-radio-group> <!-- Scheduling Type-->
                        <v-text-field label="Name*" :rules="[required('Name')]"
                            v-model="tableOverLayRefs.item.data.name"></v-text-field> <!--  Name-->
                        <v-textarea label="Description*" :rules="[required('Description')]"
                            v-model="tableOverLayRefs.item.data.desc"></v-textarea> <!--  Description-->
                        <v-text-field label="Points*" :rules="[required('Points')]"
                            v-model="tableOverLayRefs.item.data.points"></v-text-field> <!--  Points-->
                        <v-text-field label="Type" :rules="[required('Type')]"
                            v-model="tableOverLayRefs.item.data.type"></v-text-field> <!--  Type -->
                        <!-- <v-select label="Category" :items="categories" item-title="name" :rules="[required('Category')]"
                            v-model="tableOverLayRefs.item.data.category" clearable></v-select>
                         Category -->
                        <v-select label="Semesters Till Graduation*" :rules="[required('Semesters Till Graduation')]"
                            v-model="tableOverLayRefs.item.data.semestersFromGraduation" :items="semesters"></v-select>
                        <!--  Semester Till graduation out of 8 -->
                        <v-checkbox label="Reflection Required"
                            v-model="tableOverLayRefs.item.data.reflectionRequired"></v-checkbox>
                        <!--  Reflection Required-->
                        <v-checkbox label="Document Required"
                            v-model="tableOverLayRefs.item.data.documentRequired"></v-checkbox>
                        <!--  Document Required-->
                        <v-select label="Clifton Strengths" multiple v-model="tableOverLayRefs.item.cliftonStrengths"
                            :items="cliftonStrengths" item-value="id" item-title="name" clearable chips></v-select>
                        <!--  Clifton Strengths-->
                        <v-select label="Majors" multiple v-model="tableOverLayRefs.item.majors" :items="majors"
                            item-value="id" item-title="name" clearable chips></v-select>
                        <!--  Majors-->
                        <v-select v-if="tableOverLayRefs.item.dataType == 'Experience'" label="Event Type"
                            v-model="tableOverLayRefs.item.experienceEventType" :items="types" item-title="name"
                            item-value="id" clearable multiple chips></v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn variant="text" style="align-self: left !important;"
                        @click="tableOverLayRefs.dialogAdd = false">Cancel</v-btn>
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