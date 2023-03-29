import { BaseResponse, BaseResponseBody } from "./BaseResponse";
import { HttpStatusCode as HTTP } from "axios";

export default class AppResponse {
	static InvalidBody: BaseResponse = new BaseResponse(
		HTTP.BadRequest,
		new BaseResponseBody("Body does not match expected format", true)
	);

	static InvalidQuery: BaseResponse = new BaseResponse(
		HTTP.BadRequest,
		new BaseResponseBody(
			"Query parameters do not match expected format",
			true
		)
	);

	static MissingAuth: BaseResponse = new BaseResponse(
		HTTP.BadRequest,
		new BaseResponseBody("Missing authorization", true)
	);

	/**
	 * @description Use when JWT is malformed.
	 */
	static UnreadableToken: BaseResponse = new BaseResponse(
		HTTP.BadRequest,
		new BaseResponseBody("Unreadable token", true)
	);

	/**
	 * @description Use when payload["username"] and body["username"] do not match.
	 */
	static WrongToken: BaseResponse = new BaseResponse(
		HTTP.Forbidden,
		new BaseResponseBody("Token does not match current user", true)
	);

	static InvalidMethod: BaseResponse = new BaseResponse(
		HTTP.MethodNotAllowed,
		new BaseResponseBody("Invalid HTTP method", true)
	);

	static InvalidPostID: BaseResponse = new BaseResponse(
		HTTP.BadRequest,
		new BaseResponseBody("Invalid post ID", true)
	);

	static ServerError = function (error: Error): BaseResponse {
		return new BaseResponse(
			HTTP.InternalServerError,
			new BaseResponseBody(`Unexpected error: ${error}`, true)
		);
	};

	static BadRequest = function (message: string): BaseResponse {
		return new BaseResponse(
			HTTP.BadRequest,
			new BaseResponseBody(message, true)
		);
	};

	static Forbidden = function (message: string): BaseResponse {
		return new BaseResponse(
			HTTP.Forbidden,
			new BaseResponseBody(message, true)
		);
	};

	static Success = function (body: BaseResponseBody) {
		return new BaseResponse(HTTP.Ok, body);
	};
}
