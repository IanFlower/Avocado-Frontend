<template>
    <v-dialog v-model="dialogModel" height="500px" max-width="500px">
        <v-card class="d-flex flex-column">
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>Before you login we need some infomation!</span>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        <p>Semesters Till Graduation</p>
                        <v-select
                        label="Semesters Till Graduation"
                        :items="['1', '2', '3', '4', '5', '6', '7', '8']"
                        ></v-select>
                        <v-select label="Majors" multiple  :items="majors" 
                            item-value="id" item-title="name" clearable chips>
                        </v-select>                    
                    </v-col>


                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn class="bg-primary" variant="tonal"  @click="closeDialog">I WANT TO BE AN ADMIN</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue" text @click="saveDialog">Go! get outa here!</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import router from "../router";
import majorService from "../services/majors.Services";

const majors = ref([]);

// Define emits for the component
const emit = defineEmits(["update:dialog", "save"]);
onMounted(() => {
    majorService.getAllMajors().then((data) => {
        majors.value = data.data
    }).catch((error) => { console.log(error) })

});
// Define props for the component
const props = defineProps({
    dialog: Boolean,
});

// Computed property to handle the dialog visibility
const dialogModel = computed({
    get: () => props.dialog,
    set: (value) => emit("update:dialog", value),
});





// Function to close the dialog
const closeDialog = () => {
    emit("update:dialog", false);
};

// Function to save the permissions
const saveDialog = () => {
    router.push("/home");
    closeDialog();
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