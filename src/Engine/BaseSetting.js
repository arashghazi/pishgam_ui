import axios from 'axios'
import { AuthenticationController } from './Authentication';
export const settings = {
  RootServer:'https://eqasonline.ir',
  Server: `https://localhost:7276/api/V1/`,
  //Server: `https://api2.eqasonline.ir/api/V1/`,
  headers: {
    ContentType: 'application/json; charset=utf-8;',
    "Access-Control-Allow-Credentials": true,
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, DELETE",
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  lang: ['fa-IR']
};
axios.defaults.baseURL = settings.Server;
axios.defaults.timeout =800000;
axios.defaults.headers = settings.headers;
var axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  config => {
    config.headers = settings.headers;
    return config;
  },
  error => {
    Promise.reject(error)
  });
axiosInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  const errorCode = error?.response?.status;
  console.log(errorCode)
  if (errorCode === 401) {
    let result = await AuthenticationController.ReLogin();
    if ((!originalRequest._retry) && result) {
      originalRequest._retry = true;
      axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      return axiosInstance(originalRequest);
    }
    else{
      //AuthenticationController.LogOut();
    }
  } else if (errorCode === 4001) {
    //AuthenticationController.LogOut();
  }

  return Promise.reject(error);
});
export default axiosInstance;
