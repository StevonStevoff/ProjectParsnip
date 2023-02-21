import API from '../API';

const DeviceUtils = {
  async getAllUserDevices() {
    const response = await API.getUsersDevices();
    return response.data;
  },
};

export default DeviceUtils;
