import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import { describe, expect, test } from "vitest";

describe("BaseResponseBody class", () => {
	test("message property", () => {
		const body: BaseResponseBody = new BaseResponseBody("Hello world!");
		expect(body.message).toStrictEqual("Hello world!");
	});
	test("error property", () => {
		const body: BaseResponseBody = new BaseResponseBody("Hello world!");
		expect(body.error, "false by default").toStrictEqual(false);
		body.error = true;
		expect(body.error, "true after setting").toStrictEqual(true);
	});
	test("object property", () => {
		let body: BaseResponseBody = new BaseResponseBody("Hello world!");
		expect(body.object, "undefined by default").toBeUndefined();
		body = new BaseResponseBody("hi", true, { example: "property" });
		expect(body.object, "defined now").toBeDefined();
		expect(body.object, "defined now").toStrictEqual({
			example: "property",
		});
	});
});

describe("BaseResponse class", () => {
	test("statusCode property", () => {
		const res: BaseResponse = new BaseResponse(200, "");
		expect(res.statusCode).toStrictEqual(200);
	});
	test("body property", () => {
		let res: BaseResponse = new BaseResponse(200, "Hello");
		expect(res.body, "body takes string as argument").toStrictEqual(
			"Hello"
		);
		res = new BaseResponse(200, new BaseResponseBody("Hello world!", true));
		expect(
			res.body,
			"body takes BaseResponseBody as argument and converts it to string"
		).toStrictEqual(`{"message":"Hello world!","error":true}`);
	});
	test("headers property", () => {
		const res: BaseResponse = new BaseResponse(200, "");
		expect(
			res.headers,
			"headers have content-type of application/json by default"
		).toHaveProperty("content-type");
		expect(
			res.headers["content-type"],
			"headers have content-type of application/json by default"
		).toStrictEqual("application/json");
	});
});
