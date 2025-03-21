<template>
    <v-dialog v-model="dialogModel" height="500px" max-width="500px">
        <v-card class="d-flex flex-column">
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>Before you login we need some information!</span>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        <p>Semesters Till Graduation</p>
                        <v-select
                            label="Semesters Till Graduation"
                            :items="['1', '2', '3', '4', '5', '6', '7', '8']"
                            v-model="userSemestersTillGraduation"
                        ></v-select>
                        <v-select 
                            label="Majors" 
                            multiple  
                            :items="majors" 
                            item-text="name"
                            item-value="id"
                            v-model="userMajors" 
                            clearable 
                            chips 
                        />              
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn class="bg-primary" variant="tonal" @click="closeDialog">I WANT TO BE AN ADMIN</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue" text @click="saveDialog">Go! get outa here!</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import router from "../router";
import majorService from "../services/majors.Services";
import studentInfoServices from "../services/studentInfoServices";
import Utils from "../config/utils";

const majors = ref([]);
const userMajors = ref([]); // Holds selected major IDs
const userSemestersTillGraduation = ref(null);
const emit = defineEmits(["update:dialog", "save"]);

// Fetch majors on mount
onMounted(async () => {
    try {
        const { data } = await majorService.getAllMajors();
        majors.value = data;
    } catch (error) {
        console.error("Failed to load majors", error);
    }
});

// Define props
const props = defineProps({ dialog: Boolean });

// Computed dialog binding
const dialogModel = computed({
    get: () => props.dialog,
    set: (value) => emit("update:dialog", value),
});

// Close dialog function
const closeDialog = () => emit("update:dialog", false);

// Save function combining student info and linking majors via bridge table
const saveDialog = async () => {
    const user = Utils.getStore("user");
    closeDialog();

    // Update student info first
    const studentInfoPayload = {
        semestersTillGraduation: userSemestersTillGraduation.value,
    };
    await studentInfoServices.updateStudentInfo(user.id, studentInfoPayload);
    for (const majorId of userMajors.value) {
        await studentInfoServices.create(user.id, majorId);
    }



    router.push("/home");
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
