<script setup>
import { ref, onMounted, computed } from 'vue';
import badgeService from '../services/badgeServices';
import iconServices from '../services/iconServices.js';
import userBadgesServices from '../services/userBadgesServices';
import studentInfoServices from '../services/studentInfoServices';
import Utils from '../config/utils.js';
const badges = ref([]);

const badgeChunks = computed(() => {
            const chunkSize = 5;
            let chunks = [];
            for (let i = 0; i < badges.value.length; i += chunkSize) {
                chunks.push(badges.value.slice(i, i + chunkSize));
            }
            return chunks;
        });

onMounted(async () => {
    try {
        // DATA FETCHING SECTION
        const studentId = (await studentInfoServices.getStudentInfoById(Utils.getStore("user").id).catch(() => null)).data[0].id;
        let earnedBadges = (await userBadgesServices.getByStudentId(studentId).catch(() => null));
        if(earnedBadges?.data?.length > 0) {
            earnedBadges = earnedBadges.data.map(badge => badge.badgeId);
        }
        badges.value = (await badgeService.getAllBadges()).data;
        // LOGIC SECTION
        badges.value.forEach( async badge => {
            badge.earned = earnedBadges?.includes(badge.id) || false;
            if (!badge.image) {
                badge.image = null;
            }
            else{
                try{
                    badge.image = (await iconServices.getIconByFile(badge.image)).data;
                }
                catch(error){
                    console.error("Error fetching badge image:", error.message);
                    badge.image = null;
                }
            }
        });
    } catch (error) {
        console.error("Error fetching badges:", error.message);
    }
});
</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 align="center">Flight Plan Badges</h1>
            </v-col>
        </v-row>
        <v-container fluid fill-height>
            <v-card height="80vh" width="90vw" elevation="24" display="flex" justify="center" class="primary scroll"
                rounded="xl">
                <v-row v-for="(chunk, chunkIndex) in badgeChunks" :key="'chunk-' + chunkIndex" dense class="py-10 px-4">
                    <v-col cols="1"></v-col>
                    <v-col v-for="(badge, index) in chunk" :key="badge.name" cols="2"
                        class="d-flex flex-column align-center" 
                        :style="index % 2 === 1 ? ' position: relative; top: 20vh;' : 'position: relative;'">
                        <v-avatar size="12vw" :class="badge.earned ? 'accent' : 'secondary'" style="overflow: hidden;">
                            <v-img align="center" justify="center" :src="badge.image ? `data:image/*;base64,${badge.image}` : null" width="80%" height="80%"
                             class="badge_image mx-4 my-4" style="overflow: hidden;" />
                        </v-avatar>
                        <v-card class="mt-2 px-4 py-1 text-center secondary" rounded="lg" elevation="0">
                            <span>{{ badge.name }}</span>
                        </v-card>
                    </v-col>
                    <v-col cols="1"></v-col>
                </v-row>
            </v-card>
        </v-container>
        <v-spacer></v-spacer>
    </v-container>
</template>


<style scoped>
.badge_image {
  width: 80%;
  height: 80%;
  object-fit: contain;
}
.scroll {
   overflow-y: scroll
}
</style>
