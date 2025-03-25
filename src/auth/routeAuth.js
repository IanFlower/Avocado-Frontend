import Utils from '../config/utils';
import userService from '../services/userServices';
import permissionService from '../services/permissionServices';
// Function to authorize user
async function authorizeUser() {
    try {
        const storedUser = Utils.getStore("user");
        if (!storedUser) {
            // If no user is found in the store, redirect to the login page
            Utils.removeItem("user");
            return false;
        }
        const data = await userService.getUserById(storedUser.id);
        if (data.status !== 200) {
            // If the user data isn't valid, remove the user from the store and redirect to login
            Utils.removeItem("user");
            return false
        }
        return true
    } catch (error) {
        console.error("An error occurred authorizing the user");
        Utils.removeItem("user");
        return false
    }
}
// Function to authorize route access based on permissions
async function authorizeRoute(permission) {
    try {
        if(!permission) return false;
        const data = await permissionService.findByAuthToken(permission);
        if (data.status !== 200) {
            // If the user doesn't have the required permission, redirect to the unauthorized page
            return false
        }
        return true
    } catch (error) {
        console.error("An error occurred authorizing route access");
        return false
    }
}
// Enum for permissions
const ENUM = Object.freeze({
    READ_ATTENDANCE: 'readAttendance',
    WRITE_ATTENDANCE: 'writeAttendance',
    ADD_TASK: 'addTask',
    REMOVE_TASK: 'removeTask',
    ADD_EXPERIENCE: 'addExperience',
    REMOVE_EXPERIENCE: 'removeExperience',
    ADD_EVENT: 'addEvent',
    REMOVE_EVENT: 'removeEvent',
    CHANGE_EVENT: 'changeEvent',
    CHANGE_PERMISSIONS: 'changePermissions',
    READ_LOGS: 'readLogs',
    READ_STUDENT_INFO: 'readStudentInfo',
    CHANGE_STUDENT_INFO: 'changeStudentInfo',
    ADD_REWARD: 'addReward',
    REMOVE_REWARD: 'removeReward',
    REDEEM_REWARD: 'redeemReward',
    READ_STRENGTHS: 'readStrengths',
});

export { authorizeRoute, authorizeUser, ENUM };
