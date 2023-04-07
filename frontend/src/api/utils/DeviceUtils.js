import API from '../API';

const DeviceUtils = {
  async getAllUserDevices() {
    return API.getUsersDevices()
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });
  },
};

export default DeviceUtils;
