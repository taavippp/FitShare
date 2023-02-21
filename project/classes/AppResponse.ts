import { HandlerResponse } from "@netlify/functions";

type HeaderValue = boolean | number | string;

export class AppResponse implements HandlerResponse {
	statusCode: number;
	body: string;
	headers: { [header: string]: HeaderValue } = {
		"content-type": "application/json",
	};

	constructor(
		statusCode: number,
		body: AppResponseBody | string,
		headers?: { [header: string]: HeaderValue }
	) {
		this.statusCode = statusCode;
		if (body instanceof AppResponseBody) {
			body = JSON.stringify(body);
		}
		this.body = body;
		if (headers !== undefined) {
			this.headers = headers;
		}
	}
}

export class AppResponseBody {
	message: string;
	error: boolean = false;
	object?: object | undefined;

	constructor(message: string, error?: boolean, object?: object) {
		this.message = message;
		if (error !== undefined) {
			this.error = error;
		}
		if (object !== undefined) {
			this.object = object;
		}
	}
}
