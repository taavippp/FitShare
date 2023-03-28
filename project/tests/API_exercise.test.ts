import { describe, expect, test, TestOptions } from "vitest";
import { BaseResponseBody } from "../classes/BaseResponse";
import ExerciseCategory from "../classes/ExerciseCategory";
import AppRequest from "../classes/AppRequest";
import { AxiosResponse } from "axios";

const exerciseURL = "http://localhost:9999/.netlify/functions/exercise";
const userURL = "http://localhost:9999/.netlify/functions/user";
const options: TestOptions = { timeout: 10000 };
const exerciseReq: AppRequest = new AppRequest(exerciseURL);
const loginReq: AppRequest = new AppRequest(userURL).setHeader(
	"X-Login",
	"true"
);

describe(
	"api/exercise tests",
	() => {
		let res: AxiosResponse;
		let data: BaseResponseBody;

		let token: string = "";

		test("any method", async () => {
			res = await exerciseReq.send("PATCH");
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid HTTP method");
		});

		test("GET method", async () => {
			res = await exerciseReq.get();
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("All exercises");
			expect(data.object).toHaveProperty("exercises");

			res = await exerciseReq.get({ IDs: "hello" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			res = await exerciseReq.get({ IDs: "1-3-hello" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			res = await exerciseReq.get({ IDs: "1-2-3" });
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Exercises by ID");
			expect(data.object).toHaveProperty("exercises");
		});

		test("POST method", async () => {
			res = await loginReq.post({
				username: "testuser",
				password: "password",
			});
			data = res.data;
			token = data.object!.token as string;

			res = await exerciseReq.post();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await exerciseReq.post({ hello: "world" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await exerciseReq.post({ name: "test" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await exerciseReq.post({
				name: "test",
				categories: [],
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await exerciseReq.post({
				name: 0,
				categories: "test",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await exerciseReq.post({
				name: "bench press",
				categories: "test",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await exerciseReq.post({
				name: "bench press",
				categories: [ExerciseCategory.PUSH, ExerciseCategory.STRENGTH],
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await exerciseReq.setAuthorization("hello").post({
				name: "bench press",
				categories: [ExerciseCategory.PUSH, ExerciseCategory.STRENGTH],
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			res = await exerciseReq.setAuthorization(token).post({
				name: "bench press",
				categories: [ExerciseCategory.PUSH, ExerciseCategory.STRENGTH],
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			// testuser is not an admin
			expect(data.message).toStrictEqual("Not admin");

			res = await loginReq.post({
				username: "testadmin",
				password: "password",
			});
			data = res.data;
			token = data.object!.token as string;

			res = await exerciseReq.setAuthorization(token).post({
				name: "bench press",
				categories: [ExerciseCategory.PUSH, ExerciseCategory.STRENGTH],
			});
			data = res.data;
			expect(data.error, data.message).toBeFalsy();
			expect(data.message).toStrictEqual("Inserted bench press");
		});
	},
	options
);
