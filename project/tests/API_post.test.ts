import { describe, test, expect, TestOptions } from "vitest";
import { BaseResponseBody } from "../classes/BaseResponse";
import AppRequest from "../classes/AppRequest";
import { Post } from "../classes/model/Post";
import { AxiosResponse } from "axios";

const postURL = "http://localhost:9999/.netlify/functions/post";
const userURL = "http://localhost:9999/.netlify/functions/user";
const options: TestOptions = { timeout: 10000 };
const postReq = new AppRequest(postURL);
const loginReq = new AppRequest(userURL).setHeader("X-Login", "true");

describe(
	"/api/post tests",
	() => {
		let res: AxiosResponse;
		let data: BaseResponseBody;

		let token: string = "";
		let postID: string = "";

		test("invalid method", async () => {
			res = await postReq.send("PATCH");
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid HTTP method");
		});

		test("POST method", async () => {
			res = await postReq.post();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await postReq.setAuthorization("hello").post(undefined);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			// LOGIN
			res = await loginReq.post({
				username: "testuser",
				password: "password",
			});
			data = res.data;
			token = data.object!.token as string;

			res = await postReq.setAuthorization(token).post(undefined);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await postReq
				.setAuthorization(token)
				.post({ title: "123", content: [] });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await postReq
				.setAuthorization(token)
				.post({ title: "123", content: [] });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await postReq.setAuthorization(token).post({
				title: "Example post",
				content: [
					[1, 2, 3],
					[2, 5, 6],
					[-3, 8, 9],
				],
			});
			data = res.data;
			expect(data.error, data.message).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid exercise ID");

			res = await postReq.setAuthorization(token).post({
				title: "Example post",
				content: [
					[1, 2, 3],
					[4, 5, 6],
					[7, 8, 9],
				],
			});
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Post created");
			expect(data.object).toBeDefined();
			expect(data.object).toHaveProperty("id");
			if (data.object) {
				postID = data.object.id as string;
			}
		});

		test("GET method by postID", async () => {
			res = await postReq.get();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			res = await postReq.get({ hello: "world" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			res = await postReq.get({ id: "hello1234" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Post with this ID doesn't exist"
			);

			res = await postReq.get({ id: postID });
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Found post");
			expect(data.object).toBeDefined();
			expect(data.object).toHaveProperty("post");
			if (data.object) {
				const post: Post = data.object.post as Post;
				expect(post.title).toStrictEqual("Example post");
			}
		});

		test("GET method by PAGE", async () => {
			res = await postReq.get({ page: "hello" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			res = await postReq.get({ page: 0 });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			res = await postReq.get({ page: 1 });
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Posts");
			expect(data.object).toBeDefined();
			expect(data.object).toHaveProperty("posts");
		});

		test("DELETE method", async () => {
			res = await postReq.delete();
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await postReq.setAuthorization("hello").delete(undefined);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			res = await postReq.setAuthorization(token).delete(undefined);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await postReq.setAuthorization(token).delete({ id: true });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await postReq.setAuthorization(token).delete({ id: "12345" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Post with this ID doesn't exist or isn't made by this user"
			);

			res = await postReq.setAuthorization(token).delete({ id: postID });
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Post and its comments deleted");
		});
	},
	options
);
