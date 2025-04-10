<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>

    <!-- User Info Dialog Popup -->
    <UserInfoDialog
      v-model="showUserInfoDialog"  
      :user="user"
      @update:dialog="showUserInfoDialog = $event"
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
import UserInfoDialog from "./UserInfoDialog.vue";
import studentInfoServices from "../services/studentInfoServices.js";

const router = useRouter();
const user = ref({});
const showUserInfoDialog = ref(false);
const fName = ref("");
const lName = ref("");

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
      user.value.profilePicture = response.data.profilePicture; 
      fName.value = user.value.fName;
      lName.value = user.value.lName;
  })
  .catch((error) => {
    console.log("error", error);
  });

  await UserServices.getUserById(user.value.id)
  .then(async (res) => {
    try {
      const roleRes = await RoleUserServices.getRoleByUserId(user.value.id);
      const studentInfo = await studentInfoServices.getStudentInfoById(user.value.id);

      
      if ([4, 2, 3].includes(roleRes.data.roleId)) {  
        router.push({ name: 'AdminHome' });
      } else {
        if (studentInfo.data[0].firstLogin === true) { 
        showUserInfoDialog.value = true;

      }
        else {
          router.push({ name: 'StudentHome' });
        }
      }
    } catch (error) {
      const studentInfo = await studentInfoServices.getStudentInfoById(user.value.id);
      console.error("Error fetching role user", error);
      if (studentInfo.data[0].firstLogin === true) {
        showUserInfoDialog.value = true;
        studentInfoServices.updateStudentInfo(user.value.id, {  
          firstLogin: false,
        });
      }
      else {
        router.push({ name: 'StudentHome' });
      } 
    }
  })
  .catch((error) => {
    console.error("Error fetching user", error); 
  }); 
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

