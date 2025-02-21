<template>
    <v-container>
        <div class="text-h3 font-weight-bold text-center mb-4">
            Student Shop
        </div>

        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title class="d-flex justify-space-between align-center">
                        <v-row class="w-100" align="center">
                            <v-col cols="10" sm="8">
                                <v-text-field v-model="searchQuery" label="Search" outlined dense class="mx-4" />
                            </v-col>

                            <v-col cols="2" sm="4" class="text-right">
                                <v-btn color="#004761" dark @click="editRewards" class="w-auto">
                                    <v-icon left>mdi-plus</v-icon> Add Reward
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>

                    <v-data-table :headers="headers" :items="filteredUsers" class="elevation-1">
                        <template v-slot:item.fullName="{ item }">
                            <span>{{ item.fullName }}</span>
                        </template>

                        <template v-slot:item.id="{ item }">
                            <span>{{ item.id }}</span>
                        </template>

                        <template v-slot:item.points="{ item }">
                            <span>{{ item.points }}</span>
                        </template>

                        <template v-slot:item.actions="{ item }">
                            <v-btn icon @click="goToRedeemPoints(item.id)" class="transparent no-padding">
                                <v-icon>mdi-cart</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import userServices from "../services/userServices.js";

const router = useRouter();
const users = ref([]);
const searchQuery = ref("");

const headers = ref([
    { title: "Student Name", key: "fullName", align: "start", sortable: true },
    { title: "Id", key: "id", align: "start", sortable: true },
    { title: "Points", key: "points", align: "end", sortable: true },
    { title: "Actions", key: "actions", align: "center", sortable: false }
]);

const initialize = () => {
    userServices.getAllUsers()
        .then(response => {
            users.value = response.data.map(user => ({
                fullName: `${user.fName} ${user.lName}`,
                id: user.id,
                points: user.points
            }));
        })
        .catch(() => {
            users.value = [];
        });
};

const filteredUsers = computed(() => {
    return users.value
        .filter(user =>
            user.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
});

const goToRedeemPoints = (userId) => {
    router.push({ name: "redeemPoints", params: { id: userId } });
};

const editRewards = () => {
    router.push({ name: "AddReward" });
};

onMounted(initialize);
</script>