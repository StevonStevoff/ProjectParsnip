/* eslint-disable camelcase */
import API from '../API';

const NotificationUtils = {
  async getAuthenticatedUser() {
    const response = await API.getAuthenticatedUser();
    return response.data.message;
  },

  async getAllNotifications() {
    try {
      const response = await API.getUsersNotifications();
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

export default NotificationUtils;
