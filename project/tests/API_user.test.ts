import { describe, expect, test, TestOptions } from "vitest";
import { AxiosHeaders, AxiosResponse } from "axios";
import User from "../classes/model/User";
import { BaseResponseBody } from "../classes/BaseResponse";
import AppRequest from "../classes/AppRequest";

// use "npx netlify functions:serve"
const url = "http://localhost:9999/.netlify/functions/user";
const options: TestOptions = { timeout: 10000 };

describe("/api/user tests", async () => {
	let res: AxiosResponse;
	let data: BaseResponseBody;

	let token: string;

	test(
		"any method",
		async () => {
			res = await AppRequest.post(url);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.post(url, { hello: "world" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.post(url, { username: 9, password: true });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.post(url, new User("testuser", "password"));
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Request is missing X-Login header"
			);

			res = await AppRequest.request(
				"PUT",
				url,
				new User("hello", "worldson"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid HTTP method");
		},
		options
	);

	test(
		"POST method with X-Login = true",
		async () => {
			res = await AppRequest.post(
				url,
				new User("usertest", "password"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"No user with that username exists"
			);

			res = await AppRequest.post(
				url,
				new User("testuser", "wordpass"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Wrong password");

			res = await AppRequest.post(
				url,
				new User("testuser", "password"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Logged in");
			expect(data.object).toBeDefined();
			expect(data.object).toHaveProperty("token");

			// for later use
			if (data.object !== undefined) {
				token = data.object.token as string;
			}
		},
		options
	);

	test(
		"POST method with X-Login = false #1",
		async () => {
			res = await AppRequest.post(
				url,
				new User("testuser", "password"),
				new AxiosHeaders({ "X-Login": "false" })
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("User already exists");
		},
		options
	);

	test(
		"DELETE method",
		async () => {
			res = await AppRequest.delete(url, new User("hello", "worldson"));
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await AppRequest.delete(
				url,
				new User("usertest", "password"),
				new AxiosHeaders().setAuthorization("abcdef")
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			res = await AppRequest.delete(
				url,
				new User("usertest", "password"),
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message, token).toStrictEqual(
				"Token does not match current user"
			);

			res = await AppRequest.delete(
				url,
				new User("testuser", "wordpass"),
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Wrong password");

			res = await AppRequest.delete(
				url,
				new User("testuser", "password"),
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("User deleted");
		},
		options
	);

	test(
		"POST method with X-Login = false #2",
		async () => {
			res = await AppRequest.post(
				url,
				new User("testuser", "password"),
				new AxiosHeaders({ "X-Login": "false" })
			);
			data = res.data;
			expect(data.error, data.message).toBeFalsy();
			expect(data.message).toStrictEqual("User registered");
		},
		options
	);
});
