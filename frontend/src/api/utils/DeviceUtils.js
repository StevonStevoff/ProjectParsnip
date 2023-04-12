import API from '../API';

const DeviceUtils = {
  async getAllUserDevices() {
    try {
      const response = await API.getUsersDevices();
      return response.data;
    } catch (error) {
      console.error(error);
      return []; // Return an empty array in case of an error
    }
  },
  async getLinkedDevices() {
    try {
      const response = await API.getUserPlants();
      return response.data;
    } catch (error) {
      console.error(error);
      return []; // Return an empty array in case of an error
    }
  },
  async getUnlinkedDevices() {
    try {
      const allDevices = await this.getAllUserDevices();
      const linkedDevices = await this.getLinkedDevices();

      const linkedDeviceIds = linkedDevices.map((plant) => plant.device_id);
      const unlinkedDevices = allDevices.filter((device) => !linkedDeviceIds.includes(device.id));
      console.log(unlinkedDevices);
      console.log(linkedDevices);
      return unlinkedDevices;
    } catch (error) {
      console.error(error);
      return []; // Return an empty array in case of an error
    }
  },
};

export default DeviceUtils;
