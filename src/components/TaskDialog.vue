<script setup>
import PrerequisiteServices from "../services/prerequisiteServices";
import { computed, onMounted, ref, watch } from "vue";

const prerequisite = ref(null)

// Define emits for the component
const emit = defineEmits("update:dialog");

const props = defineProps({
    dialog: Boolean,
    item: String,
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
    item.value = props.item
    getPrerequisites()
}

// Watch for changes in the selected task and re-initialize
watch(() => props.item, (currItem) => {
    if (currItem) {
        initialize();
    }
});

function getPrerequisites() {
    if (item.value) {
        PrerequisiteServices.getAllForTaskId(item.value.task.id)
        .then((res) => {
            prerequisite.value = res.data
            console.log(prerequisite.value)
        })
        .catch((error) => {
            console.log("No prerequisites found, error: " + error)
        })
    }
}
</script>

<template>
    <v-dialog v-model="dialogModel" max-width="300px">
        <v-card>
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>{{ item.task.name }} - Description</span>
            </v-card-title>
            <v-card-text class="text-center">
                <v-container>
                    <v-row>{{ item.task.desc }}</v-row>
                    <v-row v-if="prerequisite" no-gutters>
                        <v-card 
                            class="w-97 pa-0 mb-5 mr-2 secondary" elevation="2" shaped
                            @click="initialize()">
                            <v-card-text class="text-h6 pa-0 pl-4">
                                <v-row class="pa-0 ma-0" height="60">
                                <v-col class="ml-4 mt-1">
                                    <v-row>{{ t.task.name }}</v-row>
                                    <v-row v-if="t.task.subtext" class=" text-subtitle-2 font-italic font-weight-thin"><v-divider vertical class="mx-3 secondary"></v-divider>{{t.task.subtext}}</v-row>
                                </v-col>
                                <v-col align="end" class="text-end">{{ t.task.points }}</v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-row>
                </v-container></v-card-text>
            <v-card-actions>
                <v-container>
                    <v-row>
                        <v-col><v-btn class="secondary justify-center" @click="closeDialog()">Close</v-btn></v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>