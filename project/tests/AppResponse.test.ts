import { describe, expect, test } from "vitest";
import { AppResponse, AppResponseBody } from "../classes/AppResponse";

describe("AppResponseBody class", () => {
	test("message property", () => {
		const body: AppResponseBody = new AppResponseBody("Hello world!");
		expect(body.message).toStrictEqual("Hello world!");
	});
	test("error property", () => {
		const body: AppResponseBody = new AppResponseBody("Hello world!");
		expect(body.error, "false by default").toStrictEqual(false);
		body.error = true;
		expect(body.error, "true after setting").toStrictEqual(true);
	});
	test("object property", () => {
		let body: AppResponseBody = new AppResponseBody("Hello world!");
		expect(body.object, "undefined by default").toBeUndefined();
		body = new AppResponseBody("hi", true, { example: "property" });
		expect(body.object, "defined now").toBeDefined();
		expect(body.object, "defined now").toStrictEqual({
			example: "property",
		});
	});
});

describe("AppResponse class", () => {
	test("statusCode property", () => {
		const res: AppResponse = new AppResponse(200, "");
		expect(res.statusCode).toStrictEqual(200);
	});
	test("body property", () => {
		let res: AppResponse = new AppResponse(200, "Hello");
		expect(res.body, "body takes string as argument").toStrictEqual(
			"Hello"
		);
		res = new AppResponse(200, new AppResponseBody("Hello world!", true));
		expect(
			res.body,
			"body takes AppResponseBody as argument and converts it to string"
		).toStrictEqual(`{"message":"Hello world!","error":true}`);
	});
	test("headers property", () => {
		const res: AppResponse = new AppResponse(200, "");
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