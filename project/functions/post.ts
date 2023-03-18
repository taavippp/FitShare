import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import PostExerciseDTO from "../classes/dto/PostExerciseDTO";
import PostExercise from "../classes/model/PostExercise";
import DataValidator from "../classes/DataValidator";
import { Collection, Db, ObjectId } from "mongodb";
import { HandlerEvent } from "@netlify/functions";
import AppDatabase from "../classes/AppDatabase";
import AppResponse from "../classes/AppResponse";
import Exercise from "../classes/model/Exercise";
import TokenDTO from "../classes/dto/TokenDTO";
import { JwtPayload } from "jsonwebtoken";
import Post from "../classes/model/Post";

type BodyPost = Omit<Post, "_id" | "userID">;
type BodyPostID = { id: string };

export async function handler(event: HandlerEvent): Promise<BaseResponse> {
	switch (event.httpMethod) {
		case "GET": {
			const query = event.queryStringParameters;
			if (!query || !query.id) {
				return AppResponse.InvalidQuery;
			}
			const postID: string = query.id;

			const collection: Collection<Post> = await AppDatabase.collection(
				"post"
			);
			const post: Post | null = await collection.findOne({ _id: postID });

			if (!post) {
				return AppResponse.BadRequest(
					"Post with this ID doesn't exist"
				);
			}

			return AppResponse.Success(
				new BaseResponseBody("Found post", false, { post })
			);
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

			const exerciseIDs: Array<number> = [];
			const content: Array<Array<number | null>> = body.content.map(
				(pe: PostExercise) => {
					exerciseIDs.push(pe.eID);
					return PostExerciseDTO.serialize(pe);
				}
			);

			if (body.title.length < 5 || body.title.length > 30) {
				return AppResponse.BadRequest(
					"Post title is over limit (5-30 symbols)"
				);
			}

			if (content.length < 1 || content.length > 25) {
				return AppResponse.BadRequest(
					"Post exercise amount is over limit (1-25)"
				);
			}

			if (
				!DataValidator.isObjectValid(
					{ title: body.title, content },
					{
						title: "string",
						content: "object",
						content$1: "object",
						content$2: "number",
					}
				)
			) {
				return AppResponse.InvalidBody;
			}

			const db: Db = await AppDatabase.connect();
			const exerciseCollection: Collection<Required<Exercise>> =
				await AppDatabase.collection("exercise", db);

			const count: number = await exerciseCollection.countDocuments({
				_id: { $in: exerciseIDs },
			});

			if (count !== exerciseIDs.length) {
				return AppResponse.BadRequest("Invalid exercise ID");
			}

			// Post ID format: random integer 0-35 + date.now()
			const randi: number = Math.round(Math.random() * 35);
			const id: string = `${randi.toString(36)}${Date.now().toString(
				36
			)}`;

			const post: Post = new Post(
				body.title,
				body.content,
				id,
				new ObjectId(payload.id)
			);

			const postCollection: Collection<Post> =
				await AppDatabase.collection("post", db);

			await postCollection.insertOne(post);
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

			const body: BodyPostID = JSON.parse(event.body);
			if (!DataValidator.isObjectValid(body, { id: "string" })) {
				return AppResponse.InvalidBody;
			}

			const postID: string = body.id;

			const db: Db = await AppDatabase.connect();
			const commentCollection: Collection<Comment> =
				await AppDatabase.collection("comment", db);
			const postCollection: Collection<Post> =
				await AppDatabase.collection("post", db);

			// should return null if it does not find the post to delete
			const post: Post | null = (
				await postCollection.findOneAndDelete({
					_id: postID,
					userID: new ObjectId(userID),
				})
			).value;

			if (!post) {
				return AppResponse.BadRequest(
					"Post with this ID doesn't exist or isn't made by this user"
				);
			}

			await commentCollection.deleteMany({ postID });

			return AppResponse.Success(
				new BaseResponseBody("Post and its comments deleted")
			);
		}
	}
	return AppResponse.InvalidMethod;
}
