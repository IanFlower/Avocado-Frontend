import { useRouter } from 'vue-router';
import Utils from '../config/utils';
import userService from '../services/userServices';

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
const authorizeRoute = async () => {
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
export { authorizeRoute, authorizeUser }