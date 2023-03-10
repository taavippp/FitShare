import { describe, expect, test, TestOptions } from "vitest";
import { AxiosHeaders, AxiosResponse } from "axios";
import { AppResponseBody } from "../classes/AppResponse";
import AppRequest from "../classes/AppRequest";
import User from "../classes/model/User";
import ExerciseCategory from "../classes/ExerciseCategory";

const url = "http://localhost:9999/.netlify/functions/exercise";
const loginUrl = "http://localhost:9999/.netlify/functions/user";
const options: TestOptions = { timeout: 10000 };

let token: string = "";

describe("api/exercise tests", () => {
	let res: AxiosResponse;
	let data: AppResponseBody;

	test("any method", async () => {
		res = await AppRequest.request("PATCH", url);
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Invalid HTTP method");
	});

	test("GET method", async () => {
		res = await AppRequest.get(url);
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Missing query parameter");

		res = await AppRequest.get(url, { hello: "world" });
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Missing query parameter");

		res = await AppRequest.get(url, { categories: "" });
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Missing query parameter");

		res = await AppRequest.get(url, { categories: "push,pull,test" });
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Invalid category");

		res = await AppRequest.get(url, { categories: "hello,world" });
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Invalid category");

		res = await AppRequest.get(url, { categories: "push,legs" });
		data = res.data;
		expect(data.error).toBeFalsy();
		expect(data.message).toStrictEqual("push, legs exercises");
		expect(data.object).toBeDefined();
		if (data.object) {
			expect(data.object.exercises).toBeDefined();
		}
	});

	test(
		"POST method",
		async () => {
			res = await AppRequest.post(
				loginUrl,
				new User("testuser", "password"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			if (data.object) {
				token = data.object.token as string;
			}

			res = await AppRequest.post(url);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Request is missing body");

			res = await AppRequest.post(url, { hello: "world" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing content in body");

			res = await AppRequest.post(url, { name: "test" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing content in body");

			res = await AppRequest.post(url, {
				name: 0,
				categories: "test",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Body content is wrong type");

			res = await AppRequest.post(url, {
				name: "bench press",
				categories: "test",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Body content is wrong type");

			res = await AppRequest.post(url, {
				name: "bench press",
				categories: [ExerciseCategory.PUSH, ExerciseCategory.STRENGTH],
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization header");

			res = await AppRequest.post(
				url,
				{
					name: "bench press",
					categories: [
						ExerciseCategory.PUSH,
						ExerciseCategory.STRENGTH,
					],
				},
				new AxiosHeaders().setAuthorization("hello")
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid token payload");

			res = await AppRequest.post(
				url,
				{
					name: "bench press",
					categories: [
						ExerciseCategory.PUSH,
						ExerciseCategory.STRENGTH,
					],
				},
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			// testuser is not an admin
			expect(data.message).toStrictEqual("Invalid token");

			res = await AppRequest.post(
				loginUrl,
				new User("testadmin", "password"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			if (data.object) {
				token = data.object.token as string;
			}

			res = await AppRequest.post(
				url,
				{
					name: "bench press",
					categories: [
						ExerciseCategory.PUSH,
						ExerciseCategory.STRENGTH,
					],
				},
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error, data.message).toBeFalsy();
			expect(data.message).toStrictEqual("Inserted bench press");
		},
		options
	);
});
