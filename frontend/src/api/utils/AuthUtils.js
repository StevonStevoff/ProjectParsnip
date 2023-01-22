import { API } from "../API";
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';

export const AuthUtils = {
  isUserAuthenticated: async function () {
    if(Device.brand != null ){ //checks the device isn't a mobile
      if(await SecureStore.getItemAsync('token')){
        return true; 
      }
    }else{
      if (window.localStorage.getItem("token") !== null) {
        return true;
      }
    }
    return false
  },

  setUserToken: async function(token){
    if(Device.brand != null){
      SecureStore.setItemAsync('token', token) !== null
    }else{
      window.localStorage.setItem("token", token);
    }
  },

  login: async function (navigation, email, password) {
    return await API.loginUser({ email: email, password: password })
      .then((response) => {
        this.setUserToken(response.data.access_token);
        navigation.navigate("Navigation");
        return "Successful Login"
      })
      .catch((error) => {
        this.handleAuthenticationError(error.response.data.detail);
        return this.errorMessage;
      });

  },

  registerUser: async function (navigation, email, password) {
    return await API.registerUser({ email: email, password: password })
      .then(() => {
        this.login(navigation, email, password);
      })
      .catch((error) => {
        this.handleAuthenticationError(error.response.data.detail);
        return this.errorMessage;
      });
  },

  logout: function (navigation) {
    API.logout();
    navigation.navigate("LoginScreen");
  },

  handleAuthenticationError: function (error) {
    switch (error) {
      case "LOGIN_BAD_CREDENTIALS":
        this.errorMessage = "Login Credentails Incorrect";
        console.log(this.errorMessage);
        break;
      case "LOGIN_USER_NOT_VERIFIED":
        this.errorMessage = "User not verified";
        break;
      case "REGISTER_USER_ALREADY_EXISTS":
        this.errorMessage = "User already exists";
        break;
      case "REGISTER_INVALID_PASSWORD":
        this.errorMessage =
          "Invalid password. Password should be at least 3 characters";
        break;
      default:
        this.errorMessage = "";
    }
  },

  getErrorMessage: function () {
    return this.errorMessage;
  },
};
