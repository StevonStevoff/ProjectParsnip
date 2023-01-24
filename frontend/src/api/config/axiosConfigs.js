import axios from 'axios';
import { notification } from 'antd';

const api = axios.create({
  baseURL: 'http://0.0.0.0:8000',
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