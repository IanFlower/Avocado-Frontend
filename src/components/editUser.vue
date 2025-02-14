<template>
  <v-dialog v-model="dialogModel" height="700px" max-width="400px">
    <v-card>
        <v-card-title class="bg-secondary text-center">
            <span >Edit User</span>
        </v-card-title>
      <v-card-text>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  dialog: Boolean,
  user: Object,
  roles: Array
});

const emit = defineEmits(['update:dialog', 'save']);

const dialogModel = computed({
  get: () => props.dialog,
  set: (value) => emit('update:dialog', value)
});

const close = () => {
  emit('update:dialog', false);
};

const save = () => {
  emit('save', user.value);
  close();
};

const user = ref({ ...props.user });

watch(() => props.user, (newUser) => {
  user.value = { ...newUser };
});
</script>

