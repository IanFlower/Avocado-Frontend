<script setup>
import { computed, onMounted, ref, watch } from "vue";
import flightPlanExperienceService from "../services/flightPlanExperienceServices";

const prerequisite = ref(null)
const docRequired = ref(false)
const showUpload = ref(false)
const upcomingEvents = ref([])
const reflection = ref("")

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
    docRequired.value = null;
    item.value = props.item
    getUpcomingEvents(item.value)
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

function getUpcomingEvents(ex) {
    if (!ex) return
    flightPlanExperienceService.getEventsByExperience(ex.Experience.id)
    .then((res) => {
        upcomingEvents.value = res.data;
    })
}

function parseTime(date) {
  let time = date.startDateTime.match(/T(\d{2}):(\d{2}):\d{2}/);

    let hours = parseInt(time[1], 10);
    let minutes = time[2];
    let period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
}


function parseDate(date) {
  let parsedDate = new Date(date.startDateTime).toDateString();
  if ( date.startDateTime.match(/\d{4}-\d{2}-(\d{2})/) != parsedDate.match(/^(?:\S+\s+){2}(\S+)/)) {
    let weekday = parsedDate.match(/^(\S+)/)
    let month = parsedDate.match(/^(?:\S+\s+)(\S+)/)
    let day = date.startDateTime.match(/\d{4}-\d{2}-(\d{2})/)
    let year = parsedDate.match(/^(?:\S+\s+){3}(\S+)/)
    parsedDate = `${weekday[0]} ${month[1]} ${day[1]} ${year[1]}`
  }
  return parsedDate;
}

async function save() {
    let subtext = ""
    if (item.value.flightPlanExperience.attended) {subtext = "Pending Approval"}
    else {subtext = "Pending"} 
    await flightPlanExperienceService.updateFlightPlanExperience(item.value.flightPlanExperience.id, {reflection: reflection.value, pending: 1, subtext: subtext})
    reflection.value = null
    emit("update:experience", true);  
    closeDialog()
}
</script>

<template>
    <v-dialog v-model="dialogModel" max-width="500px">
        <v-card>
            <v-card-title class="bg-secondary text-center sticky-title">
                <span>{{ item.Experience.name }} - Description</span>
            </v-card-title>
            <v-card-text class="text-center">
                <v-container>
                    <v-row>{{ item.Experience.desc }}</v-row>
                    <v-row align="center" v-if="upcomingEvents.length != 0"><v-col>Upcoming Events that satisfy this experience:</v-col></v-row>
                    <v-row align="center">
                        <v-col>
                            <v-card class="secondary mb-5" elevation="0" max-width="400" 
                            v-for="e in upcomingEvents" :key="e">
                                <v-row align="center" no-gutters>
                                    <v-col cols="4" class="text-center">
                                        <div class="text-subtitle-1">{{ parseDate(e) }}</div>
                                        <div class="text-caption text-grey-darken-1">{{ parseTime(e) }}</div>
                                    </v-col>
                                <v-divider vertical class="mx-2"></v-divider>
                                    <v-col>
                                        <div class="text-h6 font-weight-bold">{{ e.name }}</div>
                                        <div class="text-body-2 text-grey-darken-1">{{ e.location }}</div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row v-if="item.Experience.reflectionRequired == true"><v-textarea v-model="reflection" label="Enter reflection here"></v-textarea></v-row>
                </v-container></v-card-text>
            <v-card-actions>
                <v-container>
                    <v-row class="pa-0 ma-0 w-100">
                        <v-col align="start"><v-btn color="red darken-1" text @click="closeDialog()">Cancel</v-btn></v-col>
                        <v-col align="end"><v-btn color="blue darken-1" text @click="save">Submit</v-btn></v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>