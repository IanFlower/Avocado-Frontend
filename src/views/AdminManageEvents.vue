<script setup>

import { ref, onMounted, computed } from "vue"; // Importing Vue's reactivity and lifecycle hooks
import EventService from "../services/eventServices";
import EventTypeService from "../services/eventTypeServices";
import TypeService from "../services/typeServices";
import AddEventDialog from "../components/AddEventDialog.vue";
import DeleteDialog from "../components/DeleteDialog.vue";


const eventDialog = ref(false); // Controls new edit dialog visibility
const deleteDialog = ref(false); // Controls new edit dialog visibility
const isEdit = ref(false); // Controls edit dialog visibility
const category = "event"; // must be lowercase
const currentItem = ref();

const events = ref();
const search = ref();

const eventHeaders = [
    { title: "Event Name", key: "name" },
    { title: "Type", key: "type" },
    { title: "Date", key: "formattedStartDateTime" },
    { title: "Actions", key: "actions", sortable: false }
]

async function getAllEvents() {
    await EventService.getAllEvents()
    .then((res) => {
        events.value = res.data 
        events.value.forEach((currEvent) => { 
            console.log(currEvent.startDateTime) 
            currEvent.formattedStartDateTime = new Date(currEvent.startDateTime).toDateString();
            console.log(currEvent.startDateTime) 
        })  
    })
    .catch((error) => {
        console.log(error)
    })
    await TypeService.getAllTypes()
    .then ((typeRes) => {
        EventTypeService.getAllEventTypes()
        .then((eventTypeRes) => {
            events.value.forEach((currEvent) => {
                let newTypes = ""
                eventTypeRes.data.forEach((currEventType) => {
                    if (currEvent.id == currEventType.eventId) {      
                        let newType = typeRes.data.find((t) => {return t.id === currEventType.typeId})
                        if (newTypes == "") {newTypes += newType.name}
                        else {newTypes += `, ${newType.name}`}
                    }
                })
                
                currEvent.type = newTypes
            })
        })
        .catch((error) => {
            console.log(error)
        })

    })
    .catch ((error) => {console.log(error)})
};

onMounted(() => {
    getAllEvents();
});

const newEventDialog = async () => {
    isEdit.value = false;
    eventDialog.value = true;
};

const editEventDialog = async (item) => {
    isEdit.value = true;
    currentItem.value = item;
    eventDialog.value = true;
};

const dialogModel = computed({
  get: () => editDialog.value,
  set: (value) => editDialog.value = value
});

const deleteItem = (item) => {
    deleteDialog.value = true; 
    currentItem.value = item;
}
</script>

<template>
    <div>
        <p class="pa-12" style="font-size: 50px;">Manage Events</p>
        <div class="pa-12">
            <v-container max-width="100%" class="ma-0 pa-0">
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="search"
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                            class="ma-2"
                        ></v-text-field>
                    </v-col>
                    <v-row align-self="center" align="center" justify="end"><v-btn class="tertiary-button mr-10" @click="newEventDialog()">+ Add Event</v-btn></v-row>
                </v-row>
            </v-container>
            <v-data-table
                :headers="eventHeaders"
                :items="events"
                :search="search"
                item-value="name"
                >
                <template v-slot:item.actions="{ item }">
                    <v-icon color="#004761" class="me-2" size="small" @click="editEventDialog(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon color="#A30D11" size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
                </template>
            </v-data-table>

            <AddEventDialog
            :dialog="eventDialog"
            :isEdit="isEdit"
            :item="currentItem"
            @add="getAllEvents()"
            @update:dialog="eventDialog = $event"
            />

            <DeleteDialog 
            :dialog="deleteDialog"
            :item="currentItem" 
            :category="category"
            @update:dialog="deleteDialog = $event"
            @delete="getAllEvents()"
            />
        </div>
    </div>
</template>