<script setup>
import { ref, computed, onMounted, watch } from "vue";
import EventService from "../services/eventServices";
import TypeService from "../services/typeServices"
import EventTypeService from "../services/eventTypeServices"
import { VDateInput } from 'vuetify/labs/VDateInput'

const dialogTitle = ref("");

const typeSearch = ref(null)
const attendanceTypes = ref(["QR Code", "Sign in Sheet", "Faculty Check-in"]);
const typeNames = ref([])
const availableTypes = ref([])

const unparsedStartTime = ref(null)
const unparsedEndTime = ref(null)

const startTime = ref(null);
const endTime = ref(null);

const name = ref(null);
const description = ref(null);
const type = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const attendanceType = ref(null);
const location = ref(null);
const completionType = ref(null);
const registrationType = ref(null);

const formRef = ref(null); // Reference to the form

// Define props for the component
const props = defineProps({
    dialog: Boolean,
    isEdit: Boolean,
    item: Object,
});

// Define emits for the component
const emit = defineEmits(["update:dialog", "save"]);

// Computed property to handle the dialog visibility
const dialogModel = computed({
    get: () => props.dialog,
    set: (value) => emit("update:dialog", value),
});

onMounted(() => {
    initialize();
});

// Watch for changes in the selected user and re-initialize
watch(() => props.item, (currItem) => {
    if (currItem) {
        initialize();
    }
});

watch(() => props.isEdit, (edit) => {
    initialize();
});

// Function to close the dialog
const closeDialog = () => {
    clearFields()
    emit("update:dialog", false);
};



const clearFields = () => {
    name.value = null;
    description.value = null;
    attendanceType.value = [];
    location.value = null;
    unparsedStartTime.value = null;
    unparsedEndTime.value = null;
    startDate.value = null;
    endDate.value = null;
    type.value = []
    completionType.value = "Automatic"
    registrationType.value = "In-App"
}

const convertFromMilitary = (time) => {
    let match = null
    match = time.match(/^(\d{1,2}):\d{2}:(\d{2})/);
    if (parseInt(match[1]) > 12) {return `${parseInt(match[1]) - 12}:${match[2]} PM`
    } else if (parseInt(match[1]) == 12) { return `12:${match[2]} PM`
    } else if (parseInt(match[1]) == 0) { return `12:${match[2]} AM`
    } else return `${match[1]}:${match[2]} AM`
}

const addNewTypes = async () => {
    // Create a new type if a new type is entered
    type.value.forEach((selectedType) => {
        if (selectedType.name != null) {
            if (typeNames.value.indexOf(selectedType.name) == -1) { // If this type is a new type, add it to the list
                TypeService.createType({"name": selectedType.name})
                .then((res) => {
                    type.value.splice(type.value.indexOf(selectedType.name), 1)
                    type.value.push(res.data)
                })
                .catch((res) => {console.log(`Error: ${res.data}`)})
            }
        } else {
            if (typeNames.value.indexOf(selectedType) == -1) { // If this type is a new type, add it to the list
                TypeService.createType({"name": selectedType})
                .then((res) => {
                    type.value.splice(type.value.indexOf(selectedType), 1)
                    type.value.push(res.data)
                })
                .catch((res) => {console.log(`Error: ${res.data}`)})
            }
        }
    })
}

const parseTime = (timeToParse) => {
    let parsedTime = null
    let match = null
        match = timeToParse.match(/(\d+):(\d+) (\w+)/);
        if (match == null || match.length < 3) {return null}
        else if ((parseInt(match[1]) <= 12) && (parseInt(match[1]) >= 1) && (parseInt(match[2]) <= 59) && (parseInt(match[2]) >= 0) && ((match[3].toUpperCase() == "PM") || (match[3].toUpperCase() == "AM"))) {
            if (match[3].toUpperCase() == "AM") {
                if (parseInt(match[1]) == 12) { parsedTime = `00:${match[2]}:00` }
                else { parsedTime = `${match[1]}:${match[2]}:00` }
            } else if (parseInt(match[1]) == 12) { parsedTime = `12:${match[2]}:00` }
            else parsedTime = `${parseInt(match[1]) + 12}:${match[2]}:00`
        } else return null;
    
    return `${parsedTime}.000Z`;
}


const addNewEventType = async (eventId) => {
    await EventTypeService.deleteEventTypeByEventId(eventId)
    .then(() => {
        // Check if current type are different from type in database
        type.value.forEach((selectedType) => {
            if (selectedType.id) {
                EventTypeService.createEventType({"eventId": eventId, "typeId": selectedType.id})
                .catch((error) => {console.log(`Error: ${error.data}`)}) 
            }
        })
    })
}

const getTypes = () => {
    TypeService.getAllTypes()
    .then((res) => {
        typeNames.value = []
        availableTypes.value = []
        res.data.forEach((currType) => {
            typeNames.value.push(currType.name)
            availableTypes.value.push(currType)
        })
    })
    .catch((res) => {
        console.log(`Error: ${res.data}`)
    })
}

const getEventTypes = () => {
    EventTypeService.getTypeByEventId(props.item.id)
    .then((res) => {
        type.value = []
        res.data.forEach((typeForEvent) => {type.value.push(typeForEvent.type)})
    })
    .catch((res) => {
        console.log(`Error ${res}`)
    })
}

const compareTimes = (time1, time2) => { // true if time1 > time2
    let t1Parsed, t2Parsed = null
    t1Parsed = time1.match(/^(\d{1,2}):\d{2}:(\d{2})/);
    t2Parsed = time2.match(/^(\d{1,2}):\d{2}:(\d{2})/);
    if (parseInt(t1Parsed[1]) > parseInt(t2Parsed[1])) {return true}
    else if (parseInt(t1Parsed[1]) == parseInt(t2Parsed[1])) {
        if (parseInt(t1Parsed[2]) > parseInt(t2Parsed[2])) {return true}
        else return false
    } else return false
}

// Function to save the event
const save = async () => {

    startTime.value = parseTime(unparsedStartTime.value)
    endTime.value = parseTime(unparsedEndTime.value)

    // Date parsing
    
    let s = null
    let e = null


    try {
        s = startDate.value.toISOString().split("T")[0]
        e = endDate.value.toISOString().split("T")[0]
    }
    catch {
        s = startDate.value
        e = endDate.value
    }

    let startDateTime = `${s}T${startTime.value}`
    let endDateTime = `${e}T${endTime.value}`
 
    await addNewTypes()

    
    let currEventId = null

    if (!props.isEdit) {
        EventService.createEvent({
            "name": name.value,
            "desc": description.value,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "location": location.value,
            "attendanceType": attendanceType.value,
            "completionType": completionType.value,
            "registrationType": registrationType.value,
            "semesterId": null,
            "badgeId": null
        })
        .then((res) => {
            currEventId = res.data.id
        })
        .catch((res) => {
            console.log(`Error: ${res.data}`)
        })


    } else {
        currEventId = props.item.id
        EventService.editEvent(props.item.id, {
            "name": name.value,
            "desc": description.value,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "location": location.value,
            "attendanceType": attendanceType.value,
            "completionType": completionType.value,
            "registrationType": registrationType.value,
            "semesterId": null,
            "badgeId": null
        })
        .then((res) => {
        })
        .catch((res) => {
            console.log(`Error: ${res.data}`)
        })
    }

    
    if (currEventId != null) {
            await addNewEventType(currEventId) // Check
            emit("add")
            closeDialog();
    }
};

const initialize = async () => {

    await getTypes()

    if(props.isEdit) {
        dialogTitle.value = "Edit Event"
        name.value = props.item.name;
        description.value = props.item.desc;
        attendanceType.value = props.item.attendanceType;
        location.value = props.item.location;
        completionType.value = props.item.completionType;
        registrationType.value = props.item.registrationType;

        let s = props.item.startDateTime.toLocaleString().split("T")
        startDate.value = s[0]
        unparsedStartTime.value = convertFromMilitary(s[1])
        
        let e = props.item.endDateTime.toLocaleString().split("T")
        endDate.value = e[0]        
        unparsedEndTime.value = convertFromMilitary(e[1])

        getEventTypes()
    } else {
        dialogTitle.value = "Add Event"
        clearFields()
    }
    
}

const submitForm = () => {
    formRef.value.validate().then((isValid) => {
        if (isValid.valid) {
            save(); // Only call save() if form is valid
        }
    });
};

// Validation Rules
const nameRules = ref([
        () => {
            if (!name.value) {
                return "Event name cannot be empty"
            } else return(true)
        },
    ])

const attendanceTypeRules = ref([
    () => {
        if (attendanceType.value.length == 0) {
            return "An attendance type must be chosen"
        } else return(true)
    }
])

const startDateRules = ref([
    () => {
        if (!startDate.value) {
            return "A Start Date must be chosen"
        } else return(true)
    },

    () => {
        if (startDate.value > endDate.value) {
            return "Start Date cannot be after End Date"
        } else return(true)
    },
])

const endDateRules = ref([
    () => {
        if (!endDate.value) {
            return "A Start Date must be chosen"
        } else return(true)
    },

    () => {
        if (startDate.value > endDate.value) {
            return "End Date cannot be before Start Date"
        } else return(true)
    },
])

const startTimeRules = ref([
    () => {
        if (!unparsedStartTime.value) {
            return "A Start Time must be chosen"
        } else return(true)
    },    

    () => {
        if (parseTime(unparsedStartTime.value) == null) {return "Time must be in format: 00:00 AM"} else return(true)
    },

    () => {
        if ((startDate.value == endDate.value) && (compareTimes(parseTime(unparsedStartTime.value), parseTime(unparsedEndTime.value)))){
            return "Start Time cannot be after End Time"
        } else return(true)
    }
])

const endTimeRules = ref([
    () => {
        if (!unparsedEndTime.value) {
            return "An End Time must be chosen"
        } else return(true)
    },

    () => {
        if (parseTime(unparsedEndTime.value) == null) {return "Time must be in format: 00:00 AM"} else return(true)
    },

    () => {
        if ((startDate.value == endDate.value) && (compareTimes(parseTime(unparsedStartTime.value), parseTime(unparsedEndTime.value)))){
            return "End Time cannot be before Start Time"
        } else return(true)
    }
])

const locationRules = ref([
        () => {
            if (!location.value) {
                return "Event name cannot be empty"
            } else return(true)
        },
    ])

const typeRules = ref([
    () => {
        if (type.value.length == 0) {
            return "A type must be chosen";
        } else return(true)
    },
])
</script>
<template>
    <v-dialog scrollable v-model="dialogModel" max-width="500px">
        <v-card>
            <v-form ref="formRef" class="w-100" validate-on="blur" @submit.prevent>
                <v-card-title class="bg-secondary text-center sticky-title">{{ dialogTitle }}</v-card-title>
                <v-card-text class="flex-grow-1 d-flex">
                    <v-container>
                        <v-row><v-text-field :rules="nameRules" v-model="name" label=Name*></v-text-field></v-row>
                        <v-row><v-text-field v-model="description" label="Description"></v-text-field></v-row>
                        <v-row>
                            <v-container class="pa-0">
                                <v-combobox 
                                
                                v-model="type"
                                item-title="name"
                                v-model:search="typeSearch"
                                :rules="typeRules"
                                :hide-no-data="false"
                                :items="availableTypes"
                                label="Event Types"
                                hide-selected
                                multiple
                                closable-chips
                                chips
                                persistent-hint
                                >
                                    <template v-slot:no-data>
                                        <v-list-item>
                                        <v-list-item-title>
                                            No results matching "<strong>{{ typeSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
                                        </v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-combobox>
                            </v-container>
                        </v-row>
                        <v-row><v-select :rules="attendanceTypeRules" v-model="attendanceType" label="Attendance Type*" :items=attendanceTypes></v-select></v-row>
                        <v-row>Date and Time</v-row>
                        <v-row><v-col><v-date-input :rules="startDateRules" v-model="startDate" label="Start Date"></v-date-input></v-col>
                            <v-col><v-text-field :rules="startTimeRules" v-model="unparsedStartTime" placeholder="00:00 AM" label="Start Time"></v-text-field></v-col></v-row>
                        
                        <v-row><v-col><v-date-input :rules="endDateRules" v-model="endDate" label="End Date"></v-date-input></v-col>
                            <v-col><v-text-field :rules="endTimeRules" v-model="unparsedEndTime" placeholder="00:00 PM" label="End Time"></v-text-field></v-col></v-row>
                        
                        <v-row><v-text-field :rules="locationRules" v-model="location" label="Location*"></v-text-field></v-row>
                        <v-row>Completion Type*</v-row>
                        <v-row><v-radio-group v-model="completionType">
                            <v-radio label="Automatic" value="Automatic"></v-radio>
                            <v-radio label="Self-Reported" value="Self-Reported"></v-radio>
                            <v-radio label="OC Employee Approval" value="OC Employee Approval"></v-radio>
                        </v-radio-group></v-row>
                        <v-row>Registration Type*</v-row>
                        <v-row><v-radio-group v-model="registrationType">
                            <v-radio label="In-App" value="In-App"></v-radio>
                            <v-radio label="Handshake" value="Handshake"></v-radio>
                        </v-radio-group></v-row>
                    </v-container>
            </v-card-text>
            <v-divider></v-divider>



                <v-card-actions>
                    <v-btn color="red darken-1" text @click="closeDialog()">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text type="submit" @click="submitForm()">Save</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>