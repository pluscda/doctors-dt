"use strict";

import Vue from "vue";
import axios from "axios";

let config = {
  baseURL: process.env.NODE_ENV === 'production'? 'https://console.datacom.com.tw/' : `http://${location.hostname}:1337/`,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 720 * 1000 // Timeout
  // withCredentials: true // Check cross-site Access-Control
};


const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    if(sessionStorage.token)
       config.headers.Authorization = "Bearer " + sessionStorage.token
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
