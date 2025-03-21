<script setup>
import deletionServices from "../services/deletionServices";
import { computed, onMounted, ref } from "vue";


const props = defineProps({
    dialog: Boolean,
    item: String,
});

// Computed property to handle the dialog visibility
const dialogModel = computed({
    get: () => props.dialog
});

const item = computed({
    get: () => props.item,
})

const closeDialog = () => {
    emit("update:dialog", false);    
}

onMounted(() => {
    item.value = props.item
})
</script>

<template>
    <v-dialog v-model="dialogModel" max-width="300px">
        <v-card>
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>{{ item.task.name }}</span>
            </v-card-title>
            <v-card-text class="text-center">Information</v-card-text>
            <v-card-actions>
                <v-container>
                    <v-row>
                        <v-col><v-btn class="warning-button">Delete</v-btn></v-col>
                        <v-col><v-btn class="secondary float-right" @click="closeDialog()">Cancel</v-btn></v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>