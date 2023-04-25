import API from '../API';

const PlantUtils = {
  async getAuthenticatedUser() {
    const response = await API.getAuthenticatedUser();
    return response.data.message;
  },
  async getAuthenticatedUserData() {
    const response = await API.getUserInfo();
    return response.data;
  },
};

export default PlantUtils;
