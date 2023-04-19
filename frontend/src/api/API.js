/* eslint-disable no-use-before-define */
import qs from 'qs';
import api from './config/axiosConfigs';
import defineCancelApiObject from './config/axiosUtils';

const API = {
  async checkAPIConnection(cancel = false) {
    const response = await api.request({
      url: '/',
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
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
    this.setJWTtoken(response.data.access_token);
    return response;
  },

  setJWTtoken(token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
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

  async getUserInfo(cancel = false) {
    const response = await api.request({
      url: '/users/me',
      method: 'GET',
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },

  async getAllUsers(cancel = false) {
    const response = await api.request({
      url: '/users/',
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

  async getUsersDevices(cancel = false) {
    try {
      const response = await api.request({
        url: '/devices/me',
        method: 'GET',
        signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
          : undefined,
      });

      return response;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { response: { data: [] } };
      }
      throw error;
    }
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

  async updateDevice({ data }, cancel = false) {
    const response = await api.request({
      // eslint-disable-next-line no-template-curly-in-string
      url: `devices/${data.id}/`,
      method: 'PATCH',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },
  async getSensors(cancel = false) {
    const response = await api.request({
      url: '/sensors/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: cancel ? cancelApiObject[this.getPaginated.name].handleRequestCancellation().signal
        : undefined,
    });

    return response;
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(API);

export default API;
