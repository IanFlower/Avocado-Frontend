import axios from "axios";
import { Buffer } from 'buffer';
import Utils from "../config/utils.js";
import AuthServices from "./authServices.js";
import Router from "../router.js";

var baseurl = "";
if (import.meta.env.DEV) {
  baseurl = "http://localhost:3032/flight-plan-t2/";
} else {
  baseurl = "/flight-plan-t2/";
}

const apiImageClient = axios.create({
  baseURL: baseurl,
  responseType: "arraybuffer",
  headers: {
    Accept: "image/*",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
    crossDomain: true,
  },
  transformRequest: (data, headers) => {
    let user = Utils.getStore("user");
    if (user != null) {
      let token = user.token;
      let authHeader = "";
      if (token != null && token != "") authHeader = "Bearer " + token;
      headers["Authorization"] = authHeader;
    }
    return JSON.stringify(data);
  },
  transformResponse: function (data) {
    try {
      if (data) {
        const buffer = Buffer.from(data, 'binary');
        const base64 = buffer.toString('base64');
        return base64;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  },
});

const apiClient = axios.create({
  baseURL: baseurl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    crossDomain: true,
  },
  transformRequest: (data, headers) => {
    let user = Utils.getStore("user");
    if (user != null) {
      let token = user.token;
      let authHeader = "";
      if (token != null && token != "") authHeader = "Bearer " + token;
      headers["Authorization"] = authHeader;
    }
    return JSON.stringify(data);
  },
  transformResponse: function (data) {
    data = JSON.parse(data);
    // if (!data.success && data.code == "expired-session") {
    //   localStorage.deleteItem("user");
    // }
    if (data.message !== undefined && data.message.includes("Unauthorized")) {
      AuthServices.logoutUser(Utils.getStore("user"))
        .then((response) => {
          console.log(response);
          Utils.removeItem("user");
          Router.push({ name: "login" });
        })
        .catch((error) => {
          console.log("error", error);
        });
      // Utils.removeItem("user")
    }
    // console.log(Utils.getStore("user"))
    return data;
  },
});

export default apiClient;
export { apiClient, apiImageClient };
