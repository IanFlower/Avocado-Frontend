<script setup>
import { reactive, ref, onMounted } from 'vue';
import TableOverLay from '../components/TableOverLay.vue';
// Helper refs
const tableOverLayRefs = ref({
  selectedSemester: false,
  search: '',
  dialogAdd: false,
  dialogDelete: false,
  modelType: 'Experience'
})

// Data
const experiences = reactive([
{
    id: 0,
    name: 'Name',
    desc: 'Description',
    points: 0,
    type: 'Type',
    reflectionRequired: false,
},
{
    id: 1,
    name: 'Item2',
    desc: 'Description',
    points: 0,
    type: 'Type',
    reflectionRequired: false,
}
]);
const headers = [
    { title: 'Experience', align: 'left', key: 'name' },
    { title: 'Description', align: 'left', key: 'desc' },
    { title: 'Points', align: 'left', key: 'points' },
    { title: 'Type', align: 'left', key: 'type' },
    { title: 'Reflection Required', align: 'left', key: 'reflectionRequired' },
    { title: 'Action', align: 'left', key: 'action' }
]
function editItem(item) {


}

function deleteItem(item) {

}

const deleteItemConfirm = () => {
    dialogDelete.value = false
}

onMounted(() => {
    //fetch data  
})
</script>
<template>
    <v-container>
        <v-data-table :headers="headers" :items="experiences" :key="experiences.id" :search="tableOverLayRefs.search">
            <template v-slot:top>
                <v-toolbar color="white" v-if="tableOverLayRefs">
                    <TableOverLay v-model="tableOverLayRefs" />
                </v-toolbar>
                <v-dialog v-model="tableOverLayRefs.dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="secoundary-button" variant="text"
                                    @click="tableOverLayRefs.dialogDelete = false">Cancel</v-btn>
                                <v-btn class="warning-button" variant="text" @click="deleteItemConfirm">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
            </template>
            <template v-slot:[`item.action`]="{ item }">
                <v-icon icon="mdi-pencil-box-outline" class="me-2" size="large" @click="console.log(item)"></v-icon>
                <v-icon icon="mdi-trash-can-outline" color="red" size="large" @click="deleteItem(item)"></v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>




