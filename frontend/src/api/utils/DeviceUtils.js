/* eslint-disable camelcase */
import API from '../API';

const DeviceUtils = {
  async getCurrentUser() {
    try {
      const response = await API.getUserInfo();
      return response.data;
    } catch (error) {
      console.error(error);
      return []; // Return an empty array in case of an error
    }
  },
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
      const [currentUser, response] = await Promise.all([this.getCurrentUser(),
        API.getCurrentUsersPlants()]);

      const plants = response.data.map((plant) => {
        if (plant.device.owner.id === currentUser.id) {
          // eslint-disable-next-line no-param-reassign
          plant.device.isUserOwner = true;
        }
        return plant;
      });

      return plants;
    } catch (error) {
      console.error(error);
      return []; // Return an empty array in case of an error
    }
  },

  async updateDevice(device) {
    try {
      const data = this.createDevicePostBodyFormat(device);
      const response = await API.updateDevice({ data });
      return response;
    } catch (error) {
      console.error(error);
      return []; // Return an empty array in case of an error
    }
  },
  async updateSensorsInDevice(device, sensors) {
    // eslint-disable-next-line no-param-reassign
    device.sensors = sensors;
    try {
      const data = this.createDevicePostBodyFormat(device);
      const response = await API.updateDevice({ data });
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  async getUnlinkedDevices() {
    try {
      const [allDevices, linkedDevices, currentUser] = await Promise.all([
        this.getAllUserDevices(),
        this.getLinkedDevices(),
        this.getCurrentUser(),
      ]);

      const linkedDeviceIds = linkedDevices.map((plant) => plant.device.id);
      const unlinkedDevices = allDevices.filter((device) => !linkedDeviceIds.includes(device.id));

      unlinkedDevices.map((device) => {
        if (device.owner.id === currentUser.id) {
          // eslint-disable-next-line no-param-reassign
          device.isUserOwner = true;
        }
        return device;
      });

      return unlinkedDevices;
    } catch (error) {
      console.error(error);
      return []; // Return an empty array in case of an error
    }
  },
  createDevicePostBodyFormat(device) {
    const {
      id, name, model_name, sensors, owner, users,
    } = device;

    const sensor_ids = sensors.map((sensor) => sensor.id);
    const new_owner_id = owner.id;

    const user_ids = users.map((user) => user.id);

    const deviceData = {
      id,
      name,
      model_name,
      new_owner_id,
      sensor_ids,
      user_ids,
    };
    return deviceData;
  },
  async getAllSensors() {
    try {
      const response = await API.getSensors();
      return response.data;
    } catch (error) {
      console.error(error);
      return []; // Return an empty array in case of an error
    }
  },
  async getAllUsers() {
    try {
      const response = await API.getAllUsers();
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

export default DeviceUtils;
