import { HandlerResponse } from "@netlify/functions";

type HeaderValue = boolean | number | string;

export class BaseResponse implements HandlerResponse {
	statusCode: number;
	body: string;
	headers: { [header: string]: HeaderValue } = {
		"content-type": "application/json",
	};

	constructor(
		statusCode: number,
		body: BaseResponseBody | string,
		headers?: { [header: string]: HeaderValue }
	) {
		this.statusCode = statusCode;
		if (body instanceof BaseResponseBody) {
			body = JSON.stringify(body);
		}
		this.body = body;
		if (headers !== undefined) {
			this.headers = headers;
		}
	}
}

type ResponseBodyObject = { [property: string]: unknown } | undefined;

export class BaseResponseBody {
	message: string;
	error: boolean = false;
	object?: ResponseBodyObject;

	constructor(
		message: string,
		error: boolean = false,
		object?: ResponseBodyObject
	) {
		this.message = message;
		if (error !== undefined) {
			this.error = error;
		}
		if (object !== undefined) {
			this.object = object;
		}
	}
}
