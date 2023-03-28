import { describe, expect, test, TestOptions } from "vitest";
import { BaseResponseBody } from "../classes/BaseResponse";
import AppRequest from "../classes/AppRequest";
import { AxiosResponse } from "axios";

const userURL = "http://localhost:9999/.netlify/functions/user";
const adminURL = "http://localhost:9999/.netlify/functions/is_admin";
const options: TestOptions = { timeout: 10000 };
const adminReq: AppRequest = new AppRequest(adminURL);
const loginReq: AppRequest = new AppRequest(userURL).setHeader(
	"X-Login",
	"true"
);

describe(
	"/api/is_admin tests",
	async () => {
		let res: AxiosResponse;
		let data: BaseResponseBody;

		let token: string = "";

		test("any method", async () => {
			res = await adminReq.post();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid HTTP method");
		});

		test("GET method", async () => {
			res = await adminReq.get();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await adminReq.setAuthorization("hello").get();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			res = await loginReq.post({
				username: "testuser",
				password: "password",
			});
			data = res.data;
			token = data.object!.token as string;

			res = await adminReq.setAuthorization(token).get();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Not admin");

			res = await loginReq.post({
				username: "testadmin",
				password: "password",
			});
			data = res.data;
			token = data.object!.token as string;

			res = await adminReq.setAuthorization(token).get();
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("User is admin");
		});
	},
	options
);
