import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000",
});

instance.interceptors.request.use((configuration) => {
    configuration.headers.Authorization = window.localStorage.getItem("token");
    return configuration;
});

export default instance;
