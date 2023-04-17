/* eslint-disable no-cond-assign */
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import API from '../API';

const AuthUtils = {
  async isUserAuthenticated() {
    const token = await this.getUserToken();
    if (token == null) {
      return false;
    }
    API.setJWTtoken(token);
    return this.checkTokenVaildity();
  },
  async checkTokenVaildity() {
    return API.getAuthenticatedUser()
      .then((response) => {
        console.log(response);
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  },

  async getUserToken() {
    if (Device.brand != null) {
      return SecureStore.getItemAsync('token');
    }
    return window.localStorage.getItem('token');
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

  async updateUserInfo(name, email, username) {
    return API.updateUserInfo({ name, email, username })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });
  },

  logout(navigation) {
    API.logout();
    navigation.navigate('LoginScreen');
    this.setUserToken(null);
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
