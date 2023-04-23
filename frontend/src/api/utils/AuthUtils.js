/* eslint-disable no-cond-assign */
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import API from '../API';
import { saveState } from '../../utils/localStorage';

const AuthUtils = {
  async isUserAuthenticated() {
    const token = await this.getUserToken();
    if (token === null) {
      return false;
    }
    API.setJWTtoken(token);
    const isAuthenticated = await this.checkTokenVaildity();
    if (isAuthenticated) {
      this.scheduleTokenRefresh(); // Schedule token refresh
    }
    return isAuthenticated;
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
  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  },
  async getUserToken() {
    if (Device.brand != null) {
      return SecureStore.getItemAsync('token');
    }
    return window.localStorage.getItem('token');
  },
  async setUserToken(token) {
    if (token === null) {
      const expirationTime = new Date().getTime() + 60 * 60 * 1000;
      this.setTokenExpirationTime(expirationTime);
      if (Device.brand != null) {
        SecureStore.setItemAsync('token', '');
      } else {
        window.localStorage.setItem('token', '');
      }
      return;
    }
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // Token expires in 1 hour
    this.setTokenExpirationTime(expirationTime);
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
        this.scheduleTokenRefresh(); // Schedule token refresh
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
  async updateUserInfo(name, email, username) {
    return API.updateUserInfo({ name, email, username })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });
  },

  logout(navigation) {
    API.logout();
    if (Device.brand == null) {
      saveState('navState', null);
    }
    this.setUserToken(null);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }], // Replace with your initial route name
      }),
    );
  },
  async getProfilePicture(userID) {
    try {
      const imageBlob = await API.getProfilePicture(userID);

      if (Device.brand === null) {
        const imageURL = URL.createObjectURL(imageBlob);
        return imageURL;
      }
      const base64Image = await this.blobToBase64(imageBlob);
      const imagePath = `${FileSystem.documentDirectory}${userID}_pfp.png`;
      await FileSystem.writeAsStringAsync(
        imagePath,
        base64Image,
        { encoding: FileSystem.EncodingType.Base64 },
      );
      console.log(imagePath);
      return imagePath;
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return '../../../assets/images/avatar.png';
    }
  },
  async getUserInfo() {
    try {
      const response = await API.getUserInfo();
      response.data.profile_picture_URL = await this.getProfilePicture(response.data.id);
      return response.data;
    } catch (error) {
      if (error.response.status === 401) {
        // handle the 401 error
        if (Device.brand == null) {
          saveState('navState', null);
        }
        this.setUserToken(null);
        return null;
      }
      console.log(error);
      return null;
    }
  },
  async getTokenExpirationTime() {
    if (Device.brand != null) {
      const expirationTime = await SecureStore.getItemAsync('token-expiration-time');
      return parseInt(expirationTime, 10);
    }
    return parseInt(window.localStorage.getItem('token-expiration-time'), 10);
  },
  async setTokenExpirationTime(expirationTime) {
    if (Device.brand != null) {
      await SecureStore.setItemAsync('token-expiration-time', expirationTime.toString());
    } else {
      window.localStorage.setItem('token-expiration-time', expirationTime.toString());
    }
  },
  async refreshToken() {
    try {
      const response = await API.getRefreshToken();
      this.setUserToken(response.data.access_token);
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  },
  async scheduleTokenRefresh() {
    const expiresIn = await this.getTokenExpirationTime();
    const currentTime = new Date().getTime();
    const timeToRefresh = expiresIn - currentTime - 300 * 1000;

    if (timeToRefresh > 0) {
      setTimeout(async () => {
        try {
          await this.refreshToken();
          this.scheduleTokenRefresh();
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, timeToRefresh);
    } else {
      await this.refreshToken();
      this.scheduleTokenRefresh();
    }
  },
  async updateProfilePicture(image) {
    try {
      const response = await API.uploadProfileImage(image);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
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
