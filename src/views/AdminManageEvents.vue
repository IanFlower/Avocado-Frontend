<script setup>

import { ref, onMounted } from "vue"; // Importing Vue's reactivity and lifecycle hooks
import EventService from "../services/eventServices";

const events = ref();
const search = ref();

const eventHeaders = [
    { title: "Event Name", key: "name" },
    { title: "Type", key: "type" },
    { title: "Date", key: "startDateTime" },
    { title: "Actions", key: "actions", sortable: false }
]

async function getAllEvents() {
    await EventService.getAllEvents()
    .then((res) => {
        events.value = res.data 
        events.value.forEach((currEvent) => { 
            console.log(currEvent.startDateTime) 
            currEvent.startDateTime = new Date(currEvent.startDateTime).toDateString();
            console.log(currEvent.startDateTime) 
        })  
    })
    .catch((error) => {
        console.log(error)
    })
    
};

onMounted(() => {
    getAllEvents();
});

const createEvent = () => {

    EventService.createEvent({
        "id": 1,
        "name": "",
        "desc": null,
        "startDateTime": null,
        "endDateTime": null,
        "type": "",
        "location": "",
        "attendanceType": "",
        "completionType": "",
        "registrationType": "",
        "createdAt": null,
        "updatedAt": null,
        "semesterId": null,
        "badgeId": null
    })
};
</script>

<template>
    <div>
        <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            class="ma-2"
        ></v-text-field>
        <v-data-table
            :headers="eventHeaders"
            :items="events"
            :search="search"
            item-value="name"
            >
            <template v-slot:item.actions="{ item }">
                <v-icon color="#004761" class="me-2" size="small" @click="editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon color="#A30D11" size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
        </v-data-table>
    </div>
</template>