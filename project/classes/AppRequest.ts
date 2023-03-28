import axios, { AxiosHeaders, AxiosResponse } from "axios";

function validateStatus() {
	return true;
}
const timeout: number = 7500;

export default class AppRequest {
	URL: string;
	headers: AxiosHeaders = new AxiosHeaders();

	constructor(URL: string) {
		this.URL = URL;
		return this;
	}

	setHeader(header: string, value: any): AppRequest {
		this.headers.set(header, value);
		return this;
	}

	setAuthorization(auth: string): AppRequest {
		this.headers.setAuthorization(auth);
		return this;
	}

	get(params?: unknown): Promise<AxiosResponse> {
		return axios.get(this.URL, {
			params,
			headers: this.headers,
			timeout,
			validateStatus,
		});
	}

	post(data?: unknown): Promise<AxiosResponse> {
		return axios.post(this.URL, data, {
			headers: this.headers,
			timeout,
			validateStatus,
		});
	}

	delete(data?: unknown): Promise<AxiosResponse> {
		return axios.delete(this.URL, {
			data,
			headers: this.headers,
			timeout,
			validateStatus,
		});
	}

	send(method: string, data?: unknown): Promise<AxiosResponse> {
		return axios.request({
			method,
			url: this.URL,
			data,
			headers: this.headers,
			timeout,
			validateStatus,
		});
	}
}
