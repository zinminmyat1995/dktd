import axios from 'axios';

window.axios = axios;

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// ✅ DON'T set X-CSRF-TOKEN manually
// axios will automatically send X-XSRF-TOKEN based on XSRF-TOKEN cookie
