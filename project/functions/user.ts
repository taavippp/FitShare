import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import DataValidator from "../classes/DataValidator";
import { HandlerEvent } from "@netlify/functions";
import AppDatabase from "../classes/AppDatabase";
import AppResponse from "../classes/AppResponse";
import { Collection, ObjectId } from "mongodb";
import TokenDTO from "../classes/dto/TokenDTO";
import UserDTO from "../classes/dto/UserDTO";
import { JwtPayload } from "jsonwebtoken";
import User from "../classes/model/User";
import bcrypt from "bcrypt";

type BodyUser = Omit<User, "_id">;

export async function handler(event: HandlerEvent): Promise<BaseResponse> {
	if (!event.body) {
		return AppResponse.InvalidBody;
	}

	const body: BodyUser = JSON.parse(event.body);
	if (
		!DataValidator.isValid(body, {
			username: "string",
			password: "string",
		})
	) {
		return AppResponse.InvalidBody;
	}

	const reqUser: User | null = UserDTO.create(body.username, body.password);

	if (!reqUser) {
		return AppResponse.BadRequest(
			"Username must be 3-15 symbols (A-Z, a-z, 0-9, _) " +
				"and password must be at least 8 symbols"
		);
	}

	switch (event.httpMethod) {
		case "POST": {
			const isLogin: string | undefined = event.headers["x-login"];
			if (!isLogin || (isLogin !== "true" && isLogin !== "false")) {
				return AppResponse.BadRequest(
					"Request is missing X-Login header"
				);
			}

			if (isLogin === "true") {
				const collection: Collection<User> =
					await AppDatabase.collection("user");
				const dbUser: Required<User> | null = await collection.findOne({
					username: reqUser.username,
				});

				if (!dbUser) {
					return AppResponse.BadRequest(
						`No user with that username exists`
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
			if (token === undefined) {
				return AppResponse.MissingAuth;
			}

			const payload: JwtPayload | null = TokenDTO.deserialize(token);
			// also used to return 500 error with an unknown jwt error
			if (!payload) {
				return AppResponse.UnreadableToken;
			}
			if (
				reqUser.username !== payload["username"] ||
				!ObjectId.isValid(payload["id"])
			) {
				return AppResponse.WrongToken;
			}

			const collection: Collection<User> = await AppDatabase.collection(
				"user"
			);
			const dbUser: Required<User> | null = await collection.findOne({
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
