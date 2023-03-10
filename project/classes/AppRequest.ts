import axios, { AxiosHeaders, AxiosResponse } from "axios";

function validateStatus() {
	return true;
}
const timeout: number = 7500;

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
			timeout,
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
			timeout,
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
			timeout,
		});
	}

	static request(
		method: string,
		url: string,
		data?: unknown,
		headers?: AxiosHeaders
	): Promise<AxiosResponse> {
		return axios.request({
			method,
			url,
			data,
			headers,
			validateStatus,
			timeout,
		});
	}
}
