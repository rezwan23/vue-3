import { createStore } from "vuex";
import router from "./router";

import axios from "axios";

axios.interceptors.request.use((config) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("accessToken");

  // If token is found
  if (token) {
    // Get request headers and if headers is undefined assign blank object
    config.headers = config.headers || {};

    // Set authorization header
    // ℹ️ JSON.parse will convert token to string
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }

  // Return modified config
  return config;
});



const store = createStore({
  state() {
    return {
      apiUrl: "https://apitest.myhealthlog.in/admin/api/v1",
      isRequest : false,
      userData : {
        email : undefined,
        password : undefined
      }
    };
  },
  methods: {
    getTypes() {},
  },
  mutations: {
    requestDone(state){
      state.isRequest = false
    },
    requestStarted(state){
      state.isRequest = true
    },
    setUser(state, userData){
      state.userData = userData
    },
    removeSession(state) {
      localStorage.removeItem("userData");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userAbilities");
      state.userData = {
        email : undefined,
        password : undefined
      }
      router.push("/login");
    },
  },
});

export default store;
