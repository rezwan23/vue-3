import { createStore } from 'vuex'
import router from './router'

import axios from 'axios'


axios.interceptors.request.use(config => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('accessToken')
  
    // If token is found
    if (token) {
      // Get request headers and if headers is undefined assign blank object
      config.headers = config.headers || {}
  
      // Set authorization header
      // ℹ️ JSON.parse will convert token to string
      config.headers.Authorization = token ? `Bearer ${token}` : ''
    }
  
    // Return modified config
    return config
  })
  


const store = createStore({
    state() {
        return {
            apiUrl: 'https://apitest.myhealthlog.in/admin/api/v1',
        }
    },
    methods: {
        getTypes() {
        }
    },
    mutations: {
        removeSession(state) {
            localStorage.removeItem('userData')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('userAbilities')
            // window.location.replace(window.location.origin + '/login')
            router.push('/login');
        },
    }
})


export default store;