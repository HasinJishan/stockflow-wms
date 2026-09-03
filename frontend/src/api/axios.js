import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://stockflow-wms-backend.onrender.com', // Your backend URL
});

export default instance;