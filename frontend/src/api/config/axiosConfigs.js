import axios from 'axios';
import { notification } from 'antd';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
// eslint-disable-next-line import/no-cycle
import { handle401Error, reset401Errors } from '../utils/AuthErrorHandler';
import { saveState } from '../../utils/localStorage';

const mobileUrl = 'http://10.43.200.227:8000';

const api = axios.create({
  baseURL: Platform.OS !== 'web' ? mobileUrl : 'http://localhost:8000',
});

// defining a custom error handler for all APIs
const errorHandler = (error) => {
  const statusCode = error.response?.status;

  if (error.code === 'ERR_CANCELED') {
    notification.error({
      placement: 'bottomRight',
      description: 'API canceled!',
    });
    return Promise.resolve();
  }

  if (statusCode === 401) {
    handle401Error();
    saveState('navState', null);
    if (Device.brand != null) {
      SecureStore.deleteItemAsync('token');
    } else {
      window.localStorage.removeItem('token');
    }
  } else {
    reset401Errors();
  }

  if (statusCode && statusCode > 202) {
    console.error(error);
  }

  return Promise.reject(error);
};

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => errorHandler(error));

export default api;
