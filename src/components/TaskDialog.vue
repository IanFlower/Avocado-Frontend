<script setup>
import PrerequisiteServices from "../services/prerequisiteServices";
import documentService from "../services/documentService"; // Ensure this handles file uploads
import { ref, computed, onMounted, watch } from "vue";

const prerequisite = ref(null);
const docRequired = ref(false);
const file = ref(null); 

const emit = defineEmits(["update:dialog", "update:task"]);

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
        alert("No file selected.");
        return;
    }

    // Validate file type (e.g., only allow PDFs or images)
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
        alert("Invalid file type. Please upload a PDF or image file.");
        return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
        alert("File size exceeds the 5MB limit. Please upload a smaller file.");
        return;
    }

    // Update the file ref
    file.value = selectedFile;
    console.log("File selected:", file.value); // Debugging log
}

// Upload the file to the backend
async function upload() {
    if (!file.value) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file.value);
    console.log("Uploading file:", file.value); 

    try {
        const response = await documentService.uploadDocument(formData);
        console.log("Upload successful:", response.data);
        alert("File uploaded successfully!");
        file.value = null;
    } catch (error) {
        console.error("Upload failed:", error);
        alert("File upload failed. Please try again later.");
    }
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
                        <v-textarea label="Provide Link"></v-textarea>
                    </v-row>
                    <v-row v-if="docRequired" align="center">
                        <v-col class="text-center font-weight-bold">Or</v-col>
                    </v-row>
                    <v-row v-if="docRequired" align="center">
                        <v-col>
                            <v-file-input 
                            label="Upload Document"
                            accept=".pdf,.jpg,.jpeg,.png"
                            @change="handleFileUpload"
                            />                        
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn v-if="docRequired" class="secondary-button" text @click="closeDialog()">Cancel</v-btn>
                <v-btn v-if="docRequired" color="blue darken-1" text @click="upload()">Upload</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
