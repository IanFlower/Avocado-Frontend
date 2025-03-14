<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>

    <!-- User Info Dialog Popup -->
    <UserInfoDialog
      v-if="showUserInfoDialog"
      v-model="showUserInfoDialog"
      :user="user"
      @save="handleUserInfoSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import UserServices from "../services/userServices";
import RoleUserServices from "../services/roleUserServices";
import UserInfoDialog from "../components/UserInfoDialog.vue";

const router = useRouter();
const user = ref({});
const showUserInfoDialog = ref(true);


const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
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

  try {
    const res = await AuthServices.loginUser(token);
    user.value = res.data;
    Utils.setStore("user", user.value);

    const roleRes = await RoleUserServices.getRoleByUserId(user.value.id);

    if ([4, 2, 3].includes(roleRes.data.roleId)) {
      router.push({ name: "AdminHome" });
    } else {
      showUserInfoDialog.value = true;
    }
  } catch (error) {
    console.log("error", error);

    RoleUserServices.createRoleUser({ userId: user.value.id, roleId: 1 })
      .then(() => {
        showUserInfoDialog.value = true;
      })
      .catch((error) => console.error("Error creating RoleUser", error));
  }
};

const handleUserInfoSave = async (updatedUserInfo) => {
  try {
    const updatedUser = { ...user.value, ...updatedUserInfo };
    await UserServices.updateUser(user.value.id, updatedUser);
    Utils.setStore("user", updatedUser);
    router.push({ name: "UserHome" });
  } catch (error) {
    console.error("Error updating user info", error);
  }
};

onMounted(async () => {
  loginWithGoogle();
});
</script>

<style scoped>
.signup-buttons {
  margin-top: 20px;
}
</style>
