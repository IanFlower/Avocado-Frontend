<script setup>
import PrerequisiteServices from "../services/prerequisiteServices";
import { computed, onMounted, ref, watch } from "vue";

const prerequisite = ref(null)
const docRequired = ref(false)
const showUpload = ref(false)

// Define emits for the component
const emit = defineEmits("update:dialog", "update:experience");

const props = defineProps({
    dialog: Boolean,
    item: String,
    refresh: Boolean
});

// Computed property to handle the dialog visibility
const dialogModel = computed({
    get: () => props.dialog,
    set: (value) => emit("update:dialog", value)
});

const item = computed({
    get: () => props.item
})

const closeDialog = () => {
    emit("update:dialog", false);    
}

onMounted(() => {
    initialize()
})

function initialize() {
    prerequisite.value = null;
    docRequired.value = null;
    item.value = props.item
    getPrerequisites()
    try {docRequired.value = item.value.experience.documentRequired}
    catch {}
}

// Watch for changes in the selected experience and re-initialize
watch(() => props.item, (currItem) => {
    if (currItem) {
        initialize();
    }
});

// Watch for changes in the selected experience and re-initialize
watch(() => props.refresh, () => {
    if (props.refresh == true) {
        initialize()
    }
});

function getPrerequisites() {
    if (item.value) {
        PrerequisiteServices.getAllForExperienceId(item.value.experience.id, item.value.flightPlanExperience.flightPlanId)
        .then((res) => {
            prerequisite.value = res.data
        })
        .catch((error) => {
            console.log("No prerequisites found, error: " + error)
        })
    }
}

function openPrerequisite(prerequisite) {
    closeDialog()
    emit("update:experience", prerequisite);
}

function upload() {
    showUpload.value = true;
}
</script>

<template>
    <v-dialog v-model="dialogModel" max-width="500px">
        <v-card>
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>{{ item.experience.name }} - Description</span>
            </v-card-title>
            <v-card-text class="text-center">
                <v-container>
                    <v-row>{{ item.experience.desc }}</v-row>
                    <v-row v-if="prerequisite" align="center"><v-col class="text-center font-weight-bold">Prerequisites</v-col></v-row>
                    <v-row v-for="p in prerequisite" :key="p">
                        <v-card 
                            :class="{ 'secondary': !p.prereq.completed, 'accent': p.prereq.completed }" 
                            class="w-100 pa-0 mt-5 mr-2 " elevation="2" shaped
                            @click="openPrerequisite(p)"> 
                            <v-card-text class="text-h6 pa-0 pl-4">
                                <v-row class="pa-0 ma-0" height="60">
                                <v-col class="ml-4 mt-1">
                                    <v-row>{{ p.experience.name }}</v-row>
                                    <v-row v-if="p.flightPlanExperience.subtext" class=" text-subtitle-2 font-italic font-weight-thin"><v-divider vertical class="mx-3 secondary"></v-divider>{{p.flightPlanExperience.subtext}}</v-row>
                                </v-col>
                                <v-col align="end" class="text-end">{{ p.experience.points }}</v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-row>
                    <v-row v-if="docRequired" align="center"><v-col class="text-center font-weight-bold">Document Upload (Choose 1)</v-col></v-row>
                    <v-row v-if="docRequired" class="mt-4"><v-textarea label="Provide Link"></v-textarea></v-row>
                    <v-row v-if="docRequired" align="center"><v-col class="text-center font-weight-bold">Or</v-col></v-row>
                    <v-row v-if="docRequired" align="center"><v-col><v-btn class="secondary-button" @click="upload()">Upload a file<v-icon icon=mdi-upload-box-outline /></v-btn></v-col></v-row>
                </v-container></v-card-text>
            <v-card-actions>
                <v-btn v-if="docRequired" class="secondary-button" text @click="closeDialog()">Cancel</v-btn>
                <v-spacer v-if="docRequired"></v-spacer>
                <v-btn v-if="docRequired" color="blue darken-1" text @click="saveDialog()">Save</v-btn>
                <v-container v-if="!docRequired">
                    <v-row align="center">
                        <v-col align="center"><v-btn class="secondary" @click="closeDialog()">Close</v-btn></v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>