<script setup>
import deletionServices from "../services/deletionServices";
import { computed, onMounted, ref } from "vue";

const category = ref();

// Define emits for the component
const emit = defineEmits("update:dialog");

const props = defineProps({
    dialog: Boolean,
    category: String,
    item: String,
});

// Computed property to handle the dialog visibility
const dialogModel = computed({
    get: () => props.dialog,
    set: (value) => emit("update:dialog", value),
});

const item = computed({
    get: () => props.item,
})

const deleteItem = () => {
    deletionServices.deleteItem(category, item)
    .then(() => {
        closeDialog();
        emit("delete")
    })
}

const closeDialog = () => {
    emit("update:dialog", false);    
}

onMounted(() => {
    item.value = props.item
    category.value = props.category
})
</script>

<template>
    <v-dialog v-model="dialogModel" max-width="300px">
        <v-card>
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>Delete {{ category }}?</span>
            </v-card-title>
            <v-card-text class="text-center">Are you sure you want to delete "{{ item.name }}"</v-card-text>
            <v-card-actions>
                <v-container>
                    <v-row>
                        <v-col><v-btn class="warning-button" @click="deleteItem()">Delete</v-btn></v-col>
                        <v-col><v-btn class="secondary float-right" @click="closeDialog()">Cancel</v-btn></v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>