/* eslint-disable camelcase */
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

      const linkedDeviceIds = linkedDevices.map((plant) => plant.device.id);
      const unlinkedDevices = allDevices.filter((device) => !linkedDeviceIds.includes(device.id));
      console.log(unlinkedDevices);
      console.log(linkedDevices);
      return unlinkedDevices;
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
      return response.data;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  createDevicePostBodyFormat(device) {
    console.log('device', device);
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
      sensor_ids,
      user_ids,
    };
    console.log('deviced', deviceData);
    return deviceData;
  },
};

export default DeviceUtils;
