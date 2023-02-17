import { describe, expect, test } from "vitest";
import AppResponse from "@/../../classes/AppResponse";

describe("AppResponse.ts", () => {
	test("error property is false by default", () => {
		const res = new AppResponse("hello");
		expect(res.error, "error property is not false").toStrictEqual(false);
	});
	test("undefined error property replaced with default", () => {
		const res = new AppResponse("hello", undefined);
		expect(res.error, "error property is not false").toStrictEqual(false);
	});
	test("error property is true", () => {
		const res = new AppResponse("hello", true);
		expect(res.error, "error property is not true").toStrictEqual(true);
	});
	test("object property is missing by default", () => {
		const res = new AppResponse("hello");
		expect(res.obj, "object property is not missing").toBeUndefined();
	});
	test("undefined object property replaced with default", () => {
		const res = new AppResponse("hello", false, undefined);
		expect(res.obj, "object property is not undefined").toBeUndefined();
	});
	test("object property is defined and toString returns proper JSON", () => {
		const res = new AppResponse("hello", true, {
			test: "object",
			several: "properties",
		});
		expect(res.obj, "object property is undefined").toBeDefined();
		expect(res.toString(), "actual JSON did not match expected").toEqual(
			'{"message":"hello","error":true,"obj":{"test":"object","several":"properties"}}'
		);
	});
});
