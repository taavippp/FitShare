import { describe, expect, test } from "vitest";
import { AppResponseBody } from "@/../../classes/AppResponse";
import axios, { AxiosResponse } from "axios";

describe("functions/hello.ts", () => {
	test("properties of the response", async () => {
		const res: AxiosResponse = await axios.get(
			"http://localhost:8888/api/hello"
		);
		expect(res.data, "axios response data is undefined").toBeDefined();
		expect(res.status, "status code is not 200").toStrictEqual(200);
		expect(
			res.headers["content-type"],
			"content-type header is not json"
		).toStrictEqual("application/json");
		const data: AppResponseBody = res.data;
		expect(data.message, "message is wrong").toStrictEqual("Hello world!");
		expect(data.error, "should not have error").toStrictEqual(false);
		expect(data.object, "object should be undefined").toBeUndefined();
	});
});
