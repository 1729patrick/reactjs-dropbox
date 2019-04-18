import axios from 'axios';

const api = axios.create({
  baseURL: 'https://omnistackdropbox.herokuapp.com'
});

export default api;
