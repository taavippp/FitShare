import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import { HandlerEvent } from "@netlify/functions";
import AppDatabase from "../classes/AppDatabase";
import AppResponse from "../classes/AppResponse";
import { Collection, ObjectId, WithId } from "mongodb";
import TokenDTO from "../classes/dto/TokenDTO";
import { User, UserSchema } from "../classes/model/User";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function handler(event: HandlerEvent): Promise<BaseResponse> {
	if (!event.body) {
		return AppResponse.InvalidBody;
	}

	const reqUser: User = JSON.parse(event.body);
	const { success } = UserSchema.safeParse(reqUser);

	if (!success) {
		return AppResponse.InvalidBody;
	}

	switch (event.httpMethod) {
		case "POST": {
			const loggingIn: string | undefined = event.headers["x-login"];
			if (!loggingIn || (loggingIn !== "true" && loggingIn !== "false")) {
				return AppResponse.BadRequest(
					"Request is missing X-Login header"
				);
			}

			if (loggingIn === "true") {
				const collection: Collection<User> =
					await AppDatabase.collection("user");
				const dbUser: WithId<User> | null = await collection.findOne({
					username: reqUser.username,
				});

				if (!dbUser) {
					return AppResponse.BadRequest(
						"No user with that username exists"
					);
				}

				try {
					const match: boolean = await bcrypt.compare(
						reqUser.password,
						dbUser.password
					);
					if (!match) {
						return AppResponse.BadRequest("Wrong password");
					}
				} catch (error) {
					return AppResponse.ServerError(error);
				}

				const token: string = TokenDTO.serialize({
					username: reqUser.username,
					id: dbUser._id,
				});

				return AppResponse.Success(
					new BaseResponseBody("Logged in", false, { token })
				);
			} else {
				const collection: Collection<User> =
					await AppDatabase.collection("user");
				const dbUser: User | null = await collection.findOne({
					username: reqUser.username,
				});

				if (dbUser) {
					return AppResponse.BadRequest("User already exists");
				}

				try {
					reqUser.password = await bcrypt.hash(reqUser.password, 10);
					collection.insertOne(reqUser);
				} catch (error) {
					return AppResponse.ServerError(error);
				}

				return AppResponse.Success(
					new BaseResponseBody("User registered")
				);
			}
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

			if (
				reqUser.username !== payload.username ||
				!ObjectId.isValid(payload.id)
			) {
				return AppResponse.WrongToken;
			}

			const collection: Collection<User> = await AppDatabase.collection(
				"user"
			);

			const dbUser: User | null = await collection.findOne({
				username: reqUser.username,
			});
			if (!dbUser) {
				return AppResponse.BadRequest("User doesn't exist");
			}

			try {
				const match: boolean = await bcrypt.compare(
					reqUser.password,
					dbUser.password
				);
				if (!match) {
					return AppResponse.BadRequest("Wrong password");
				}
			} catch (error) {
				return AppResponse.ServerError(error);
			}

			collection.deleteOne({ username: reqUser.username });
			return AppResponse.Success(new BaseResponseBody("User deleted"));
		}
	}
	return AppResponse.InvalidMethod;
}
