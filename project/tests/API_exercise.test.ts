import { describe, expect, test, TestOptions } from "vitest";
import { AxiosHeaders, AxiosResponse } from "axios";
import { BaseResponseBody } from "../classes/BaseResponse";
import AppRequest from "../classes/AppRequest";
import User from "../classes/model/User";
import ExerciseCategory from "../classes/ExerciseCategory";
import Exercise from "../classes/model/Exercise";

const exerciseURL = "http://localhost:9999/.netlify/functions/exercise";
const userURL = "http://localhost:9999/.netlify/functions/user";
const options: TestOptions = { timeout: 10000 };

let token: string = "";

describe("api/exercise tests", () => {
	let res: AxiosResponse;
	let data: BaseResponseBody;

	test("any method", async () => {
		res = await AppRequest.request("PATCH", exerciseURL);
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Invalid HTTP method");
	});

	test("GET method", async () => {
		res = await AppRequest.get(exerciseURL);
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual(
			"Query parameters do not match expected format"
		);

		res = await AppRequest.get(exerciseURL, { hello: "world" });
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual(
			"Query parameters do not match expected format"
		);

		res = await AppRequest.get(exerciseURL, { categories: "" });
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual(
			"Query parameters do not match expected format"
		);

		res = await AppRequest.get(exerciseURL, {
			categories: "push,pull,test",
		});
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Invalid category");

		res = await AppRequest.get(exerciseURL, { categories: "hello-world" });
		data = res.data;
		expect(data.error).toBeTruthy();
		expect(data.message).toStrictEqual("Invalid category");

		res = await AppRequest.get(exerciseURL, { categories: "push-legs" });
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
				userURL,
				new User("testuser", "password"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			if (data.object) {
				token = data.object.token as string;
			}

			res = await AppRequest.post(exerciseURL);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.post(exerciseURL, { hello: "world" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.post(exerciseURL, { name: "test" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.post(exerciseURL, {
				name: "test",
				categories: [],
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.post(exerciseURL, {
				name: 0,
				categories: "test",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.post(exerciseURL, {
				name: "bench press",
				categories: "test",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			// res = await AppRequest.post(
			// 	exerciseURL,
			// 	new Exercise("bench press", [
			// 		ExerciseCategory.PUSH,
			// 		ExerciseCategory.STRENGTH,
			// 	])
			// );
			// data = res.data;
			// expect(data.error).toBeTruthy();
			// expect(data.message).toStrictEqual("Missing authorization");

			res = await AppRequest.post(
				exerciseURL,
				new Exercise("bench press", [
					ExerciseCategory.PUSH,
					ExerciseCategory.STRENGTH,
				]),
				new AxiosHeaders().setAuthorization("hello")
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			res = await AppRequest.post(
				exerciseURL,
				new Exercise("bench press", [
					ExerciseCategory.PUSH,
					ExerciseCategory.STRENGTH,
				]),
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			// testuser is not an admin
			expect(data.message).toStrictEqual("Not admin");

			res = await AppRequest.post(
				userURL,
				new User("testadmin", "password"),
				new AxiosHeaders({ "X-Login": "true" })
			);
			data = res.data;
			if (data.object) {
				token = data.object.token as string;
			}

			res = await AppRequest.post(
				exerciseURL,
				new Exercise("bench press", [
					ExerciseCategory.PUSH,
					ExerciseCategory.STRENGTH,
				]),
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error, data.message).toBeFalsy();
			expect(data.message).toStrictEqual("Inserted bench press");
		},
		options
	);
});
