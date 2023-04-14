/* eslint-disable no-use-before-define */
import qs from 'qs';
import api from './config/axiosConfigs';
import defineCancelApiObject from './config/axiosUtils';

const API = {
  async get(cancel = false) {
    const response = await api.request({
      url: '/',
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
  async registerUser({
    email, password, name, username,
  }, cancel = false) {
    const response = await api.request({
      url: '/auth/register',
      method: 'POST',
      data: {
        email,
        password,
        name,
        username,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });
    return response;
  },

  async loginUser({ username, password }, cancel = false) {
    const response = await api.request({
      url: '/auth/jwt/login',
      method: 'POST',
      data: qs
        .stringify({
          username,
          password,
        })
        .replace(/%40/, '@'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
          : undefined,
      },
    });
    api.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;
    return response;
  },
  async logout(cancel = false) {
    const response = await api.request({
      url: '/auth/jwt/logout',
      method: 'POST',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });
    return response;
  },

  async getAuthenticatedUser(cancel = false) {
    const response = await api.request({
      url: '/authenticated-route',
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },
  async registerPlant({ name, device_id ,plant_profile_id,plant_type_id,outdoor,latitude,longitude}, cancel = false) {
    const response = await api.request({
      url: '/plants/register',
      method: 'POST',
      data: {
        name,
         device_id ,
         plant_profile_id,
         plant_type_id,
         outdoor,
         latitude,
         longitude,
      },
      headers: {
        'Content-Type': 'application/json'

      },
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });
    return response;
  },

  async getCurrentUsersPlants(cancel = false) {
    const response = await api.request({
      url: '/plants/me',
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },

  async getPlantData(id,cancel = false) {
    const response = await api.request({
      url:  `/plants/${id}/data`,
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },

  async deletePlant(id,cancel = false) {
    const response = await api.request({ 
      url: `/plants/${id}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'},
        signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
          : undefined,
      });
  
      return response;
    },

  async editPlant({id, name, device_id ,plant_profile_id,plant_type_id,time_planted,outdoor,latitude,longitude}, cancel = false) {
    const response = await api.request({
      url: `/plants/${id}`,
      method: 'PATCH',
      data: {
        name,
         device_id ,
         plant_profile_id,
         plant_type_id,
         time_planted,outdoor,
         latitude,
         longitude
      },
      headers: {
        'Content-Type': 'application/json'

      },
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });
    return response;
  },

  async getUserInfo(cancel = false) {
    const response = await api.request({
      url: '/users/me',
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },


  async updateUserInfo({ name, email, username }, cancel = false) {
    const response = await api.request({
      url: '/users/me',
      method: 'PATCH',
      data: {
        name,
        email,
        username,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },

  async getAllPlantTypes(cancel = false) {
    const response = await api.request({
      url: '/plant_types/',
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },

  async getAllDevices(cancel = false) {
    const response = await api.request({
      url: '/devices/me',
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },

  async getAllPlantProfiles(cancel = false) {
    const response = await api.request({
      url: '/plant_profiles/',
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(API);

export default API;
