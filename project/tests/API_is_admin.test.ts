import { describe, expect, test, TestOptions } from "vitest";
import { AxiosHeaders, AxiosResponse } from "axios";
import User from "../classes/model/User";
import { AppResponseBody } from "../classes/AppResponse";
import AppRequest from "../classes/AppRequest";

const loginUrl = "http://localhost:9999/.netlify/functions/user";
const url = "http://localhost:9999/.netlify/functions/is_admin";
const options: TestOptions = { timeout: 10000 };

describe(
	"/api/is_admin tests",
	async () => {
		let res: AxiosResponse;
		let data: AppResponseBody;

		let token: string = "";

		test("any method", async () => {
			res = await AppRequest.post(url);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid HTTP method");
		});

		test("GET method", async () => {
			res = await AppRequest.get(url);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization header");

			res = await AppRequest.get(
				url,
				{},
				new AxiosHeaders().setAuthorization("hello")
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid token payload");

			res = await AppRequest.post(
				loginUrl,
				new User("testuser", "password"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			if (data.object) {
				token = data.object.token as string;
			}

			res = await AppRequest.get(
				url,
				{},
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid token or not admin");

			res = await AppRequest.post(
				loginUrl,
				new User("testadmin", "password"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			if (data.object) {
				token = data.object.token as string;
			}

			res = await AppRequest.get(
				url,
				{},
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("testadmin is admin");
		});
	},
	options
);
