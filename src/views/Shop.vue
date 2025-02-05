<template>
        <v-card class="d-flex flex-column pa-5 text-center my-5 accent clickable-card" width="50%" elevation="16" @click="goHome">
          <v-card-title>Points:</v-card-title>
        </v-card>
</template>

<script setup>

  const goHome = () => {
    router.push('/home'); 
  };

</script>

<!-- AGAIN I SAY THESE ARE PLACEHOLDERS FOR NOW! DONT GET MAD AT ME FOR MAKING IT EASIER ON YOU ALL!-->