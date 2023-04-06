import axios from "axios";
import { notification } from "antd";
import { Platform } from "react-native";

var backendUrl = process.env.BACKEND_URL;
var androidDevUrl = process.env.ANDROID_DEV_URL;

backendUrl = backendUrl === undefined ? "http://localhost:8000" : backendUrl;
androidDevUrl =
  androidDevUrl === undefined ? "http://10.43.204.119:8000" : androidDevUrl;

const api = axios.create({
  baseURL: Platform.OS === "android" ? androidDevUrl : backendUrl,
});

// defining a custom error handler for all APIs
const errorHandler = (error) => {
  const statusCode = error.response?.status;

  if (error.code === "ERR_CANCELED") {
    notification.error({
      placement: "bottomRight",
      description: "API canceled!",
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
