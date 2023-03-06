import axios, { AxiosHeaders, AxiosResponse } from "axios";

function validateStatus() {
	return true;
}

export default class AppRequest {
	static get(
		url: string,
		params?: unknown,
		headers?: AxiosHeaders
	): Promise<AxiosResponse> {
		return axios.get(url, {
			params,
			validateStatus,
			headers,
			timeout: 10000,
		});
	}

	static post(
		url: string,
		data?: unknown,
		headers?: AxiosHeaders
	): Promise<AxiosResponse> {
		return axios.post(url, data, {
			validateStatus,
			headers,
			timeout: 10000,
		});
	}

	static delete(
		url: string,
		data?: unknown,
		headers?: AxiosHeaders
	): Promise<AxiosResponse> {
		return axios.delete(url, {
			data,
			validateStatus,
			headers,
			timeout: 10000,
		});
	}
}
