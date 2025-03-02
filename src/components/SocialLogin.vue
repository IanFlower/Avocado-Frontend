<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";
import UserServices from "../services/userServices";
import RoleUserServices from "../services/roleUserServices"; 
import RoleServices from "../services/roleServices"; 
import studentInfoServices from "../services/studentInfoServices.js";   
const router = useRouter();
const fName = ref("");
const lName = ref("");
const user = ref({});

const roles = [
  { id: 1, name: 'student' },
  { id: 2, name: 'student worker' }, 
  { id: 3, name: 'admin' },
  { id: 4, name: 'professor' }
];

const createRolesIfNotExist = async () => {
  for (const role of roles) {
    await RoleServices.getRoleById(role.id)
      .catch(async () => {
        await RoleServices.createRole(role)
      });
  }
};


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
  .then(async (res) => {

 
    try {
      // Create RoleUser with userId and roleId=1 if not found
      const roleRes = await RoleUserServices.getRoleByUserId(user.value.id);
      
      if ([4, 2, 3].includes(roleRes.data.roleId)) { 

        router.push({ name: 'AdminHome' });

      } else {
        router.push({ name: 'StudentHome' }); 
      }
    } catch (error) {
      // If the role does not exist, create it and redirect to StudentHome
      RoleUserServices.createRoleUser({ userId: user.value.id, roleId: 1 })
        .then(() => {

          router.push({ name: 'StudentHome' });
        })
        .catch((error) => {
          console.error("Error creating RoleUser", error);
        });
    }
  })
  .catch((error) => {
    console.error("Error fetching user", error);
  }); 


    
      
};

onMounted(async () => {
  createRolesIfNotExist();

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
