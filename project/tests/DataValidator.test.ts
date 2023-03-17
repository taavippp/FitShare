import { describe, expect, test } from "vitest";
import DataValidator from "../classes/DataValidator";

const data = {
	str: "world",
	num: 1,
	bool: true,
	arr: [1, 2, 3],
	deepArr: [[1, 2, 3]],
};

describe("DataValidator tests", () => {
	test("validateObject function - passes", () => {
		const result: boolean = DataValidator.isObjectValid(data, {
			str: "string",
			num: "number",
			bool: "boolean",
			arr: "object",
			arr$1: "number",
			deepArr: "object",
			deepArr$1: "object",
			deepArr$2: "number",
		});
		expect(result).toBeTruthy();
	});

	test("validateObject function - partial - does not pass", () => {
		const result: boolean = DataValidator.isObjectValid(data, {
			str: "string",
			bool: "number",
			arr: "object",
			deepArr$2: "string",
		});
		expect(result).toBeFalsy();
	});

	test("validateObject function - partial - passes", () => {
		const result: boolean = DataValidator.isObjectValid(data, {
			str: "string",
			bool: "boolean",
			arr: "object",
			deepArr$2: "number",
		});
		expect(result).toBeTruthy();
	});
});
