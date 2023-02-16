import API from '../API';

const PlantUtils = {
  async getAuthenticatedUser() {
    const response = await API.getAuthenticatedUser();
    return response.data.message;
  },
};

export default PlantUtils;
