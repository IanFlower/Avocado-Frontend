<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import UserServices from "../services/userServices";

const router = useRouter();
const fName = ref("");
const lName = ref("");
const user = ref({});
// const isAdmin = ref({});

const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  console.log(client);
  window.google.accounts.id.initialize({
    client_id: client,
    cancel_on_tap_outside: false,
    auto_select: true,
    callback: window.handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(document.getElementById("parent_id"), {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    width: 400,
  });
};

const handleCredentialResponse = async (response) => {
  let token = {
    credential: response.credential,
  };
  await AuthServices.loginUser(token)
    .then((response) => {
      user.value = response.data;
      Utils.setStore("user", user.value);
      fName.value = user.value.fName;
      lName.value = user.value.lName;
    })
    .catch((error) => {
      console.log("error", error);
    });

    

    await UserServices.getUserById(user.value.id) 
      .then((res) => {
        if (res.data.role == "Admin" | res.data.role == "Student Worker" | res.data.role == "Professor") {
          router.push({ name: 'AdminHome' });
        }
        else {
          router.push({ name: 'StudentHome' }
          );
        }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  loginWithGoogle();
});
</script>

<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>
  </div>
</template>
