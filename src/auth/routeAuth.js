import { useRouter } from 'vue-router';
import Utils from '../config/utils';
import userService from '../services/userServices';
import permissionService from '../services/permissionServices';

const authorizeUser = async () => {
    const router = useRouter();
    const storedUser = Utils.getStore("user");
    if(!storedUser) {
        router.push({ name: "Login" });
        return;
    }
    await userService.getUserById(storedUser.id).then((data) => {
        console.log(data)
        if(data.status != 200) {
            Utils.removeItem("user");
            router.push({ name: "Login" });
        }
    }).catch((error) => {
        console.log("An error occurred authorizing user")
        Utils.removeItem("user");
        router.push({ name: "Login" });
    })
    return;
}

const authorizeRoute = async (permission) => {
    const router = useRouter();
    const storedUser = Utils.getStore("user");
    await permissionService.findByUser(storedUser.id).then((data) => {
        console.log(data)
        if(data.status != 200) {
            Utils.removeItem("user");
            router.push({ name: "Login" });
        }
    }).catch((error) => {
        console.log("An error occurred authorizing user")
        Utils.removeItem("user");
        router.push({ name: "Login" });
    })
    return;
}

const ENUM = Object.freeze({
    READ_ATTENDANCE: 'readAttendance',
    WRITE_ATTENDANCE: 'writeAttendance',
    ADD_TASK:'addTask',
    REMOVE_TASK:'removeTask',
    ADD_EXPERIENCE:'addExperience',
    REMOVE_EXPERIENCE:'removeExperience',
    ADD_EVENT:'addEvent',
    REMOVE_EVENT:'removeEvent',
    CHANGE_EVENT:'changeEvent',
    CHANGE_PERMISSIONS:'changePermissions',
    READ_LOGS:'readLogs',
    READ_STUDENT_INFO:'readStudentInfo',
    CHANGE_STUDENT_INFO:'changeStudentInfo',
    ADD_REWARD:'addReward',
    REMOVE_REWARD:'removeReward',
    REDEEM_REWARD:'redeemReward',
    READ_STRENGTHS:'readStrengths',
  });

export { authorizeRoute, authorizeUser, ENUM }