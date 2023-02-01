import axios from 'axios';
import { notification } from 'antd';
import { Platform } from 'react-native';

const androidDevUrl = 'http://10.43.204.119:8000';

const api = axios.create({
  baseURL: Platform.OS === 'android' ? androidDevUrl : 'http://localhost:8000',
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

  // logging only errors that are not 401
  if (statusCode && statusCode > 202) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return Promise.reject(error);
};

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => errorHandler(error));

export default api;
