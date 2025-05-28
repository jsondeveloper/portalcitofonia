import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // ajusta según backend
  withCredentials: true
});

export const login = (username, password) =>
  API.post('/auth/login', { username, password });

export const getExtensions = () =>
  API.get('/extensions');

export const updateExtensions = (data) =>
  API.put('/extensions', data);

export const writeConf = () =>
  API.post('/extensions/write');
