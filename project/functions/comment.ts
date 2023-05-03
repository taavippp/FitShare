import { HandlerEvent } from "@netlify/functions";
import { JwtPayload } from "jsonwebtoken";
import { Collection, ObjectId, WithId } from "mongodb";
import AppDatabase from "../classes/AppDatabase";
import AppResponse from "../classes/AppResponse";
import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import TokenDTO from "../classes/dto/TokenDTO";
import {
	ServerComment,
	ClientComment,
	ServerCommentSchema,
} from "../classes/model/Comment";
import { Post } from "../classes/model/Post";
import { PostIDSchema } from "../classes/model/PostID";
import { User } from "../classes/model/User";

type BodyComment = { text: string; postID: string };

export async function handler(event: HandlerEvent): Promise<BaseResponse> {
	switch (event.httpMethod) {
		case "GET": {
			const query = event.queryStringParameters;
			if (!query || !query.id) {
				return AppResponse.InvalidQuery;
			}

			const { success } = PostIDSchema.safeParse(query.id);
			if (!success) {
				return AppResponse.InvalidPostID;
			}

			const db: AppDatabase = await new AppDatabase().connect();

			const postCollection: Collection<Post> = db.collection("post");
			const post: Post | null = await postCollection.findOne({
				id: query.id,
			});
			if (!post) {
				await db.close();
				return AppResponse.InvalidPostID;
			}

			const commentCollection: Collection<ServerComment> =
				db.collection("comment");
			const userCollection: Collection<WithId<User>> =
				db.collection("user");

			const serverComments: Array<ServerComment> = await commentCollection
				.find({ postID: query.id })
				.sort({ timestamp: "asc" })
				.toArray();

			const userIDs: Array<ObjectId> = serverComments.map((comment) => {
				return comment.userID;
			});
			const users: Array<WithId<User>> = await userCollection
				.find({
					_id: { $in: userIDs },
				})
				.project<WithId<User>>({ password: false, _id: true })
				.toArray();

			const comments: Array<ClientComment> = serverComments.map(
				(comment) => {
					return {
						postID: comment.postID,
						text: comment.text,
						username: users.find((user) => {
							return user._id === comment.userID;
						})!.username,
						timestamp: comment.timestamp,
					};
				}
			);
			return AppResponse.Success(
				new BaseResponseBody(`Comments of ${query.id}`, false, {
					comments,
				})
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
			const userID: string = payload.id;

			if (!event.body) {
				return AppResponse.InvalidBody;
			}

			const body: BodyComment = JSON.parse(event.body);
			const validationData: ServerComment = {
				userID: new ObjectId(userID),
				text: body.text,
				postID: body.postID,
			};

			const result = ServerCommentSchema.safeParse(validationData);
			if (!result.success) {
				return AppResponse.InvalidBody;
			}
			const comment: ServerComment = result.data;

			const db: AppDatabase = await new AppDatabase().connect();
			const postCollection: Collection<Post> = db.collection("post");
			const post: Post | null = await postCollection.findOne({
				id: comment.postID,
			});
			if (!post) {
				await db.close();
				return AppResponse.InvalidPostID;
			}
			const commentCollection: Collection<ServerComment> =
				db.collection("comment");
			await commentCollection.insertOne(comment);

			await db.close();
			return AppResponse.Success(new BaseResponseBody("Comment created"));
		}
	}
	return AppResponse.InvalidMethod;
}
