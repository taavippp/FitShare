import { AxiosHeaders, AxiosResponse } from "axios";
import { describe, test, expect, TestOptions } from "vitest";
import AppRequest from "../classes/AppRequest";
import { BaseResponseBody } from "../classes/BaseResponse";
import Post from "../classes/model/Post";
import PostExercise from "../classes/model/PostExercise";
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
			res = await AppRequest.post(postURL);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await AppRequest.post(
				postURL,
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

			res = await AppRequest.post(
				postURL,
				new Post("012345678901234567890123456789TooMany", []),
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Post title is over limit (5-30 symbols)"
			);

			res = await AppRequest.post(
				postURL,
				new Post("Example post", []),
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Post exercise amount is over limit (1-25)"
			);

			res = await AppRequest.post(
				postURL,
				new Post("Example post", [
					new PostExercise(1, 3, 5, 6),
					new PostExercise(3, 3, 30),
					// Invalid ID
					new PostExercise(-3, 4, 2, 8),
				]),
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Invalid exercise ID");

			res = await AppRequest.post(
				postURL,
				new Post("Example post", [
					new PostExercise(1, 3, 5, 6),
					new PostExercise(3, 3, 30),
					new PostExercise(5, 4, 2, 8),
				]),
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Post created");
			expect(data.object).toBeDefined();
			expect(data.object).toHaveProperty("id");
			if (data.object) {
				postID = data.object.id as string;
			}
		});

		test("GET method", async () => {
			res = await AppRequest.get(postURL);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			res = await AppRequest.get(postURL, { hello: "world" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Query parameters do not match expected format"
			);

			res = await AppRequest.get(postURL, { id: "hello" });
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Post with this ID doesn't exist"
			);

			res = await AppRequest.get(postURL, { id: postID });
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

		test("DELETE method", async () => {
			res = await AppRequest.delete(postURL);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Missing authorization");

			res = await AppRequest.delete(
				postURL,
				{},
				new AxiosHeaders().setAuthorization("hello")
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual("Unreadable token");

			res = await AppRequest.delete(
				postURL,
				{},
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.delete(
				postURL,
				{ id: true },
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Body does not match expected format"
			);

			res = await AppRequest.delete(
				postURL,
				{ id: "12345" },
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeTruthy();
			expect(data.message).toStrictEqual(
				"Post with this ID doesn't exist or isn't made by this user"
			);

			res = await AppRequest.delete(
				postURL,
				{ id: postID },
				new AxiosHeaders().setAuthorization(token)
			);
			data = res.data;
			expect(data.error).toBeFalsy();
			expect(data.message).toStrictEqual("Post and its comments deleted");
		});
	},
	options
);
