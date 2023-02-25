import { describe, expect, test } from "vitest";
import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import User from "../classes/model/User";
import { AppResponseBody } from "../classes/AppResponse";

const URL = "http://localhost:8888/api/user";

// otherwise, axios throws error at 4xx and 5xx
function config(data?: any, headers?: AxiosHeaders): AxiosRequestConfig {
	return {
		data,
		headers,
		validateStatus: () => true,
		timeout: 10000,
	};
}

describe("/api/user tests", async () => {
	let res: AxiosResponse;
	let data: AppResponseBody;

	let token: string;

	test("any method", async () => {
		res = await axios.get(URL, config());
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Request is missing body");

		res = await axios.get(URL, config({ hello: "world" }));
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Missing content in body");

		res = await axios.get(URL, config({ username: true, password: 1 }));
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Body content is wrong type");

		res = await axios.get(URL, config(new User("ab", "password")));
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual(
			"Username must consist of 3-15 characters and can only include A-Z, numbers and _"
		);

		res = await axios.get(
			URL,
			config(new User("abcabcabcabcabcabc", "password"))
		);
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual(
			"Username must consist of 3-15 characters and can only include A-Z, numbers and _"
		);

		res = await axios.get(URL, config(new User("_test", "password")));
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual(
			"Username must consist of 3-15 characters and can only include A-Z, numbers and _"
		);

		res = await axios.get(URL, config(new User("123test", "password")));
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual(
			"Username must consist of 3-15 characters and can only include A-Z, numbers and _"
		);

		res = await axios.get(URL, config(new User("testuser", "passwo")));
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual(
			"Password must be at least 8 characters"
		);

		res = await axios.patch(URL, new User("hello", "worldson"), config());
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Invalid HTTP method");
	});

	test("GET method", async () => {
		res = await axios.get(URL, config(new User("usertest", "password")));
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("No user with that username exists");

		res = await axios.get(URL, config(new User("testuser", "wordpass")));
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Wrong password");

		res = await axios.get(URL, config(new User("testuser", "password")));
		data = res.data;
		expect(data.error).toBeFalsy();
		expect(data.message).toStrictEqual("Logged in");
		expect(data.object).toBeDefined();
		expect(data.object).toHaveProperty("token");

		// for later use
		if (data.object !== undefined) {
			token = data.object["token"];
		}
	});

	test("POST method #1", async () => {
		res = await axios.post(URL, new User("testuser", "password"), config());
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("User already exists");
	});

	test("DELETE method", async () => {
		res = await axios.delete(URL, config(new User("hello", "worldson")));
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Missing authorization header");

		res = await axios.delete(
			URL,
			config(
				new User("usertest", "password"),
				new AxiosHeaders().setAuthorization("abcdef")
			)
		);
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Invalid token payload");

		res = await axios.delete(
			URL,
			config(
				new User("usertest", "password"),
				new AxiosHeaders().setAuthorization(token)
			)
		);
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Invalid token");

		res = await axios.delete(
			URL,
			config(
				new User("testuser", "wordpass"),
				new AxiosHeaders().setAuthorization(token)
			)
		);
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Wrong password");

		res = await axios.delete(
			URL,
			config(
				new User("testuser", "password"),
				new AxiosHeaders().setAuthorization(token)
			)
		);
		data = res.data;
		expect(data.error).toBeFalsy();
		expect(data.message).toStrictEqual("User testuser deleted");
	});

	test("POST method #2", async () => {
		res = await axios.post(URL, new User("testuser", "password"), config());
		data = res.data;
		expect(data.error).toBeFalsy();
		expect(data.message).toStrictEqual("User testuser registered");
	});
});
