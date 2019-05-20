import axios from 'axios';

const api = axios.create({ baseURL: "https://api.adsim.co/crm/api/v1/refrigerante/listar" });

export default api;