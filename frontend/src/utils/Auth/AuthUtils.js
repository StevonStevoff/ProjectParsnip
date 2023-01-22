import * as SecureStore from "expo-secure-store";
import { API } from "../../api/API";
import React from "react";

export const AuthUtils = {
  isUserAuthenticated: async function () {
    return await SecureStore.getItemAsync(token);
  },

  login: function (navigation, email, password) {
    API.loginUser({ email: email, password: password }).then((response) => {
      if (response.status.code > 203) {
        handleAuthenticationError(response.status.message);
      } else {
        localStorage.setItem(token, response.data.token);
        navigation.navigate("Navigation");
      }
    });
  },

  registerUser: function (email, password) {
    API.registerUser({ email: email, password: password }).then((response) => {
      if (response.status.code > 203) {
        handleAuthenticationError(response.status.message);
      } else {
        this.login({ email, password });
      }
    });
  },

  logout: function (navigation) {
    API.logout();
    navigation.navigate("LoginScreen");
  },

  handleAuthenticationError: function (error) {
    error
      .replace("_", " ")
      .toLowerCase()
      .replace(/^./, function (str) {
        return str.toUpperCase();
      });
    AuthUtils.errorMessage = error;
  },

  errorMessage: "",
};
