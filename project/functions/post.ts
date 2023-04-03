import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import { ServerPostElement } from "../classes/model/ServerPostElement";
import { Post, PostSchema } from "../classes/model/Post";
import { Exercise } from "../classes/model/Exercise";
import { Collection, Db, ObjectId, WithId } from "mongodb";
import { HandlerEvent } from "@netlify/functions";
import AppDatabase from "../classes/AppDatabase";
import AppResponse from "../classes/AppResponse";
import TokenDTO from "../classes/dto/TokenDTO";
import { JwtPayload } from "jsonwebtoken";
import { PostIDSchema } from "../classes/model/PostID";
import { User } from "../classes/model/User";

type BodyPost = { title: string; content: Array<ServerPostElement> };

const PER_PAGE: number = 10;

export async function handler(event: HandlerEvent): Promise<BaseResponse> {
	switch (event.httpMethod) {
		case "GET": {
			const query = event.queryStringParameters;
			if (!query || (!query.id && !query.page)) {
				return AppResponse.InvalidQuery;
			}

			if (query.id) {
				const { success } = PostIDSchema.safeParse(query.id);
				if (!success) {
					return AppResponse.InvalidPostID;
				}

				const db: AppDatabase = await new AppDatabase().connect();
				const collection: Collection<Required<Post>> =
					db.collection("post");

				const post: Required<Post> | null = await collection.findOne(
					{
						id: query.id,
					},
					{
						projection: {
							_id: false,
							id: false,
						},
					}
				);
				if (!post) {
					await db.close();
					return AppResponse.BadRequest(
						"Post with this ID doesn't exist"
					);
				}

				const userCollection: Collection<User> = db.collection("user");
				const user: User | null = await userCollection.findOne({
					_id: post.userID,
				});
				await db.close();

				return AppResponse.Success(
					new BaseResponseBody("Found post", false, {
						post,
						user: user?.username || "DELETED USER",
					})
				);
			}

			if (query.page) {
				const page: number = Number.parseInt(query.page);
				if (isNaN(page) || page < 1) {
					return AppResponse.InvalidQuery;
				}

				const db: AppDatabase = await new AppDatabase().connect();
				const collection: Collection<Post> = db.collection("post");
				const posts: Array<Post> = await collection
					.find()
					.project<Post>({
						_id: false,
						userID: false,
						content: false,
					})
					.sort({ timestamp: "desc", title: "asc" })
					.skip((page - 1) * PER_PAGE)
					.limit(PER_PAGE)
					.toArray();
				await db.close();

				return AppResponse.Success(
					new BaseResponseBody("Posts", false, { posts })
				);
			}
		}
		case "POST": {
			const token: string | undefined = event.headers.authorization;
			if (!token) {
				return AppResponse.MissingAuth;
			}

			const payload: JwtPayload | null = TokenDTO.deserialize(token);
			if (!payload) {
				return AppResponse.UnreadableToken;
			}

			if (!event.body) {
				return AppResponse.InvalidBody;
			}

			const body: BodyPost = JSON.parse(event.body);

			const { success } = PostSchema.safeParse(body);
			if (!success) {
				return AppResponse.InvalidBody;
			}

			const exerciseIDs: Set<number> = new Set();
			for (let exercise of body.content) {
				exerciseIDs.add(exercise[0]);
			}

			const db: AppDatabase = await new AppDatabase().connect();
			const exerciseCollection: Collection<Required<Exercise>> =
				db.collection("exercise");

			const count: number = await exerciseCollection.countDocuments({
				id: { $in: Array.from(exerciseIDs) },
			});

			if (count !== exerciseIDs.size) {
				await db.close();
				return AppResponse.BadRequest("Invalid exercise ID");
			}

			// Post ID format: random integer 0-35 + date.now()
			const randi: number = Math.round(Math.random() * 35);
			const now: number = Date.now();
			const id: string = `${randi.toString(36)}${now.toString(36)}`;

			const post: Post = {
				title: body.title,
				content: body.content,
				userID: new ObjectId(payload.id),
				id: id,
				timestamp: now,
			};

			const postCollection: Collection<Post> = db.collection("post");

			await postCollection.insertOne(post);
			await db.close();
			return AppResponse.Success(
				new BaseResponseBody(`Post created`, false, { id })
			);
		}
		case "DELETE": {
			const token: string | undefined = event.headers.authorization;
			if (!token) {
				return AppResponse.MissingAuth;
			}

			const payload: JwtPayload | null = TokenDTO.deserialize(token);
			if (!payload) {
				return AppResponse.UnreadableToken;
			}
			const userID: string = payload.id;

			if (!event.body) {
				return AppResponse.InvalidBody;
			}

			const body: Pick<Post, "id"> = JSON.parse(event.body);
			if (!body.id) {
				return AppResponse.InvalidBody;
			}

			const postID: string = body.id;

			const { success } = PostIDSchema.safeParse(postID);
			if (!success) {
				return AppResponse.InvalidPostID;
			}

			const db: AppDatabase = await new AppDatabase().connect();
			const commentCollection: Collection<Comment> =
				db.collection("comment");
			const postCollection: Collection<Post> = db.collection("post");

			// should return null if it does not find the post to delete
			const post: Post | null = (
				await postCollection.findOneAndDelete({
					id: postID,
					userID: new ObjectId(userID),
				})
			).value;

			if (!post) {
				await db.close();
				return AppResponse.BadRequest(
					"Post with this ID doesn't exist or isn't made by this user"
				);
			}

			await commentCollection.deleteMany({ postID });
			await db.close();

			return AppResponse.Success(
				new BaseResponseBody("Post and its comments deleted")
			);
		}
	}
	return AppResponse.InvalidMethod;
}
