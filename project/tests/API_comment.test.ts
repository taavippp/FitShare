import { describe, test, expect, TestOptions } from "vitest";
import { BaseResponseBody } from "../classes/BaseResponse";
import AppRequest from "../classes/AppRequest";
import { AxiosResponse } from "axios";

const userURL: string = "http://localhost:9999/.netlify/functions/user";
const commentURL: string = "http://localhost:9999/.netlify/functions/comment";
// Actual valid post ID.
const postID: string = "ilfrkt3sd";

const userReq: AppRequest = new AppRequest(userURL).setHeader(
	"X-Login",
	"true"
);
const commentReq: AppRequest = new AppRequest(commentURL);

const options: TestOptions = { timeout: 10000 };

describe(
	"api/comment tests!",
	() => {
		let res: AxiosResponse;
		let data: BaseResponseBody;
		let token: string;

		test("POST method", async () => {
			// 1. auth
			res = await commentReq.post();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await commentReq.setAuthorization("hello").post();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			// log in for valid token
			res = await userReq.post({
				username: "testuser",
				password: "password",
			});
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Logged in");
			expect(data.object).toBeDefined();
			expect(data.object).toHaveProperty("token");
			token = data.object!.token as string;

			// 2. valid body
			res = await commentReq.setAuthorization(token).post();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await commentReq.setAuthorization(token).post({
				notText: "comment text! amazing!",
				postID: "testpostid",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await commentReq.setAuthorization(token).post({
				text: true,
				postID: "testpostid",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			// 3. check post ID
			res = await commentReq.setAuthorization(token).post({
				text: "comment text! amazing!",
				postID: "testpostid",
			});
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid post ID");

			// 4. insert
			res = await commentReq.setAuthorization(token).post({
				text: "comment text! amazing!",
				postID,
			});
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Comment created");
		});

		test("GET method", async () => {
			// 1. check query and query.id
			res = await commentReq.get();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			res = await commentReq.get({ hello: "world" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			// 2. zod parse query.id
			res = await commentReq.get({ id: "hello" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid post ID");

			// 3. check if post exists
			res = await commentReq.get({ id: "testpostid" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid post ID");

			// 4. ALL comments of post (probably heavy if there's a lot of comments)
			res = await commentReq.get({ id: postID });
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual(`Comments of ${postID}`);
			expect(data.object).toBeDefined();
			expect(data.object).toHaveProperty("comments");
		});
	},
	options
);
