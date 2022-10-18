const configs = require('../config/config');
const baseUrl =
  configs.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://stuma.herokuapp.com';

export default baseUrl;
