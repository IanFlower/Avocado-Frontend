<script setup>
import { defineModel } from 'vue'
const tableOverLayRefs = defineModel()
const emptyItem = {
    dataType: "Task",
    data: { id: 0, name: '', desc: '', points: 0, type: '', reflectionRequired: false, subtext: '', priority: 0, semestersFromGraduation: 0, documentRequired: false },
    experienceEventType: [],
    majors: [],
    cliftonStrengths: []
}
</script>
<template>
    <v-row>
        <v-col cols="2">
            <v-text-field prepend-inner-icon="mdi-magnify" v-model="tableOverLayRefs.search" label="Search" clearable
                single-line hide-details variant="outlined" rounded="lg" density="compact"></v-text-field>
        </v-col>
        <v-col cols="8">
            <v-row align="center" justify="center">
                <v-col cols="2">
                <v-btn variant="text" rounded="lg" class="mx-1" 
                    @click="tableOverLayRefs.selectedSemester > 0 ? tableOverLayRefs.selectedSemester-- : tableOverLayRefs.selectedSemester = 0">Previous</v-btn>
                </v-col>
                <v-col cols="8">
                <v-btn-toggle v-model="tableOverLayRefs.selectedSemester" mandatory  class="flex-wrap: wrap;">
                    <v-btn  rounded="lg" variant="tonal" class="secondary-button mx-1 mb-1"  v-for="numbers in 8" :key="numbers">{{ numbers
                        }}</v-btn>
                </v-btn-toggle>
                </v-col>
                <v-col cols="2">
                <v-btn variant="text" rounded="lg" class="mx-1"
                    @click="tableOverLayRefs.selectedSemester == 7 ? tableOverLayRefs.selectedSemester = 7 : tableOverLayRefs.selectedSemester++">Next</v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="2">
            <v-btn variant="tonal" rounded="lg" class="ml-auto alt-button"
                @click="tableOverLayRefs.item = JSON.parse(JSON.stringify(emptyItem)), tableOverLayRefs.dialogAdd = true" text="Add Task/Experience">
                </v-btn>
        </v-col>
    </v-row>
</template>


<style scoped>
.v-btn--active {
    background-color: #004761 !important;
    color: white !important;
}
.v-btn {
    font-size: 0.8em !important; 
}
:deep(.v-btn__content) {
    white-space: pre-wrap;
}
:deep(.v-btn-toggle) {
    flex-wrap: wrap;
}
</style>