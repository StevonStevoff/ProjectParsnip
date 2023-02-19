import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import API from '../API';

const AuthUtils = {
  async isUserAuthenticated() {
    if (Device.brand != null) { // checks the device isn't a mobile
      if (await SecureStore.getItemAsync('token')) {
        return true;
      }
    } else if (window.localStorage.getItem('token') !== null) {
      return true;
    }
    return false;
  },

  async setUserToken(token) {
    if (Device.brand != null) {
      SecureStore.setItemAsync('token', token);
    } else {
      window.localStorage.setItem('token', token);
    }
  },

  async login(navigation, username, password) {
    return API.loginUser({ username, password })
      .then((response) => {
        this.setUserToken(response.data.access_token);
        navigation.navigate('Navigation');
        return 'Successful Login';
      })
      .catch((error) => {
        this.handleAuthenticationError(error.response.data.detail);
        return Promise.reject(this.errorMessage);
      });
  },

  async registerUser(navigation, email, password, name, username) {
    return API.registerUser({
      email, password, name, username,
    })
      .then(() => {
        this.login(navigation, username, password);
      })
      .catch((error) => {
        this.handleAuthenticationError(error.response.data.detail);
        return Promise.reject(this.errorMessage);
      });
  },

  async getUserInfo() {
    return API.getUserInfo()
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });
  },

  async updateUserInfo(name, email) {
    return API.updateUserInfo(name, email)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });
  },

  logout(navigation) {
    API.logout();
    navigation.navigate('LoginScreen');
  },

  handleAuthenticationError(error) {
    switch (error) {
      case 'LOGIN_BAD_CREDENTIALS':
        this.errorMessage = 'Login Credentails Incorrect';
        break;
      case 'LOGIN_USER_NOT_VERIFIED':
        this.errorMessage = 'User not verified';
        break;
      case 'REGISTER_USER_ALREADY_EXISTS':
        this.errorMessage = 'User already exists';
        break;
      case 'REGISTER_INVALID_PASSWORD':
        this.errorMessage = 'Invalid password. Password should be at least 3 characters';
        break;
      default:
        this.errorMessage = '';
    }
  },

  getErrorMessage() {
    return this.errorMessage;
  },
};

export default AuthUtils;
