import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
	throw new Error("API URL not defined");
}

const api = axios.create({
	baseURL: apiUrl,
});

export default api;
