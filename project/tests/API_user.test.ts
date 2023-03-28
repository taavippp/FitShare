import { describe, expect, test, TestOptions } from "vitest";
import { BaseResponseBody } from "../classes/BaseResponse";
import AppRequest from "../classes/AppRequest";
import { AxiosResponse } from "axios";

// use "npx netlify functions:serve"
const URL = "http://localhost:9999/.netlify/functions/user";
const options: TestOptions = { timeout: 10000 };
const request: AppRequest = new AppRequest(URL);

describe(
	"/api/user tests",
	async () => {
		let res: AxiosResponse;
		let data: BaseResponseBody;

		let token: string;

		test(
			"any method",
			async () => {
				res = await request.post();
				data = res.data;
				expect(data.error).toBeTruthy();
				expect(data.message).toStrictEqual(
					"Body does not match expected format"
				);

				res = await request.post({ hello: "world" });
				data = res.data;
				expect(data.error).toBeTruthy();
				expect(data.message).toStrictEqual(
					"Body does not match expected format"
				);

				res = await request.post({ username: 9, password: true });
				data = res.data;
				expect(data.error).toBeTruthy();
				expect(data.message).toStrictEqual(
					"Body does not match expected format"
				);

				res = await request.post({
					username: "testuser",
					password: "password",
				});
				data = res.data;
				expect(data.error).toBeTruthy();
				expect(data.message).toStrictEqual(
					"Request is missing X-Login header"
				);

				res = await request.setHeader("X-Login", "true").send("PUT", {
					username: "hello",
					password: "worldson",
				});
				data = res.data;
				expect(data.error).toBeTruthy();
				expect(data.message).toStrictEqual("Invalid HTTP method");
			},
			options
		);

		test("POST method with X-Login = true", async () => {
			res = await request
				.setHeader("X-Login", "true")
				.post({ username: "usertest", password: "password" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"No user with that username exists"
			);

			res = await request
				.setHeader("X-Login", "true")
				.post({ username: "testuser", password: "wordpass" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Wrong password");

			res = await request
				.setHeader("X-Login", "true")
				.post({ username: "testuser", password: "password" });
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Logged in");
			expect(data.object).toBeDefined();
			expect(data.object).toHaveProperty("token");

			// For later use
			token = data.object!.token as string;
		});

		test("POST method with X-Login = false #1", async () => {
			res = await request
				.setHeader("X-Login", "false")
				.post({ username: "testuser", password: "password" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("User already exists");
		});

		test("DELETE method", async () => {
			res = await request.delete({
				username: "hello",
				password: "worldson",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await request
				.setAuthorization("abcdef")
				.delete({ username: "usertest", password: "password" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			res = await request
				.setAuthorization(token)
				.delete({ username: "usertest", password: "password" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message, token).toStrictEqual(
				"Token does not match current user"
			);

			res = await request
				.setAuthorization(token)
				.delete({ username: "testuser", password: "wordpass" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Wrong password");

			res = await request
				.setAuthorization(token)
				.delete({ username: "testuser", password: "password" });
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("User deleted");
		});

		test("POST method with X-Login = false #2", async () => {
			res = await request
				.setHeader("X-Login", "false")
				.post({ username: "testuser", password: "password" });
			data = res.data;
			expect(data.error, data.message).toBeFalsy();
			expect(data.message).toStrictEqual("User registered");
		});
	},
	options
);
