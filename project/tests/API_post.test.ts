import { AxiosHeaders, AxiosResponse } from "axios";
import { describe, test, expect, TestOptions } from "vitest";
import AppRequest from "../classes/AppRequest";
import { BaseResponseBody } from "../classes/BaseResponse";
import User from "../classes/model/User";

const postURL = "http://localhost:9999/.netlify/functions/post";
const userURL = "http://localhost:9999/.netlify/functions/user";
const options: TestOptions = { timeout: 10000 };

describe(
	"/api/post tests",
	() => {
		let res: AxiosResponse;
		let data: BaseResponseBody;

		let token: string = "";
		let postID: string = "";

		test("invalid method", async () => {
			res = await AppRequest.request("PATCH", postURL);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid HTTP method");
		});

		test("POST method", async () => {
			res = await AppRequest.post(postID);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await AppRequest.post(
				postID,
				undefined,
				new AxiosHeaders().setAuthorization("hello")
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			// LOGIN
			res = await AppRequest.post(
				userURL,
				new User("testuser", "password"),
				new AxiosHeaders({ "X-Login": true })
			);
			data = res.data;
			if (data.object) {
				token = data.object.token as string;
			}

			res = await AppRequest.post(
				postURL,
				undefined,
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			// LINE 55
		});
	},
	options
);
