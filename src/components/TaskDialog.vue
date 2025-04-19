<script setup>
import PrerequisiteServices from "../services/prerequisiteServices";
import documentService from "../services/documentService";
import studentInfoServices from "../services/studentInfoServices";
import { ref, computed, onMounted, watch } from "vue";
import Utils from "../config/utils";
import flightPlanTaskService from "../services/flightPlanTaskServices";

const user = Utils.getStore("user");
const prerequisite = ref(null);
const link = ref(null);
const documentName = ref(null);

const docRequired = ref(false);
const file = ref(null);

const emit = defineEmits(["update:dialog", "update:task", "update:refresh"]);

const props = defineProps({
    dialog: Boolean,
    item: Object,
    refresh: Boolean
});

const dialogModel = computed({
    get: () => props.dialog,
    set: (value) => emit("update:dialog", value)
});

const item = computed(() => props.item);

const closeDialog = () => {
    emit("update:dialog", false);
};

onMounted(() => {
    initialize();
});

function initialize() {
    prerequisite.value = null;
    docRequired.value = false;
    docRequired.value = item.value?.task?.documentRequired || false;
    link.value = item.value?.task?.link || null;
    // item.value = props.item;
    getPrerequisites();
    try {
        docRequired.value = item.value.task.documentRequired;
    } catch (e) {
        console.error(e);
    }

}

watch(() => props.item, (currItem) => {
    if (currItem) {
        initialize();
    }
});

watch(() => props.refresh, () => {
    if (props.refresh === true) {
        initialize();
    }
});

function getPrerequisites() {
    if (item.value) {
        PrerequisiteServices.getAllForTaskId(
            item.value.task.id,
            item.value.flightPlanTask.flightPlanId
        )
            .then((res) => {
                prerequisite.value = res.data;
            })
            .catch((error) => {
                console.log("No prerequisites found, error: " + error);
            });
    }
}

function openPrerequisite(prerequisite) {
    closeDialog();
    emit("update:task", prerequisite);
}

// Handle file selection
function handleFileUpload(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
        console.error("No file selected");
        return;
    }
    file.value = selectedFile;
}

// Upload the file to the backend
async function upload() {
    const fileData = {
        file: file.value,
        flightPlanTaskId: item.value.flightPlanTask.id,
    };

    try {
        if (file.value) {
            const response = await documentService.uploadDocument(fileData);
            console.log(response)
            documentName.value = response.filePath.replace('/studentUploads/', '');
            console.log("File uploaded successfully:", response);
            closeDialog();
        }
    } catch (error) {
        console.error("File upload failed:", error);
    }

    flightPlanTaskService.updateFlightPlanTask(
        item.value.flightPlanTask.id,
        {
            documentName: documentName.value,
            link: link.value,
            pending: true,
            subtext: "Pending"
        }
    )
        .then((res) => {
            console.log("Flight plan task updated successfully:", res.data);
            emit("update:refresh", true);
            closeDialog();
        })
        .catch((error) => {
            console.error("Error updating flight plan task:", error);
        });
}


</script>

<template>
    <v-dialog v-model="dialogModel" max-width="500px">
        <v-card>
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>{{ item.task.name }} - Description</span>
            </v-card-title>
            <v-card-text class="text-center">
                <v-container>
                    <v-row class="text-left">{{ item.task.desc }}</v-row>
                    <v-row v-if="docRequired" align="center">
                        <v-col class="text-center font-weight-bold">
                            Document Upload
                        </v-col>
                    </v-row>
                    <v-row v-if="docRequired" class="mt-4">
                        <v-text-field label="Provide Link" v-model="link"></v-text-field>
                    </v-row>
                    <v-row v-if="docRequired" align="center">
                        <v-col class="text-center font-weight-bold">Or</v-col>
                    </v-row>
                    <v-row v-if="docRequired" align="center">
                        <v-col>
                            <v-file-input label="Upload Document" accept=".pdf,.jpg,.jpeg,.png"
                                @change="handleFileUpload" />
                        </v-col>
                    </v-row>

                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn v-if="docRequired" class="secondary-button" text @click="closeDialog()">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn v-if="docRequired" color="blue darken-1" text @click="upload()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
