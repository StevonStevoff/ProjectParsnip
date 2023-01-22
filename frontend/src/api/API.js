import { api } from "./config/axiosConfigs";
import { defineCancelApiObject } from "./config/axiosUtils";
import qs from "qs";

export const API = {
  get: async function (cancel = false) {
    const response = await api.request({
      url: `/`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
  registerUser: async function ({ email, password }, cancel = false) {
    const response = await api.request({
      url: "/auth/register",
      method: "POST",
      data: {
        email: email,
        password: password,
      },
      headers: {
        "Content-Type": "application/json",
      },
      signal: cancel
        ? cancelApiObject[this.getPaginated.name].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response;
  },

  loginUser: async function ({ email, password }, cancel = false) {
    const response = await api.request({
      url: "/auth/jwt/login",
      method: "POST",
      data: qs
        .stringify({
          username: email,
          password: password,
        })
        .replace(/%40/, "@"),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    api.defaults.headers.common["Authorization"] = 'Bearer ' + response.data.access_token;
    return response;
  },
  logout: async function (cancel = false){
    const response = await api.request({
      url: "/auth/jwt/logout",
      method: "POST"
    })
    return response;
  },

  getAuthenticatedUser: async function (cancel = false) {
    const response = await api.request({
        url: "/authenticated-route",
        method: "GET",
      })

    return response;
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(API);
