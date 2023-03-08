import { HandlerEvent } from "@netlify/functions";
import { AppResponse, AppResponseBody } from "@/../../classes/AppResponse";
import AppDatabase from "../classes/AppDatabase";
import { Collection, ObjectId } from "mongodb";
import User from "../classes/model/User";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import UserDTO from "../classes/dto/UserDTO";

interface BodyUser {
	username: string | unknown | undefined;
	password: string | unknown | undefined;
}

export async function handler(event: HandlerEvent): Promise<AppResponse> {
	if (!event.body) {
		return new AppResponse(
			400,
			new AppResponseBody("Request is missing body", true)
		);
	}

	const body: BodyUser = JSON.parse(event.body);
	if (body.username === undefined || body.password === undefined) {
		return new AppResponse(
			400,
			new AppResponseBody("Missing content in body", true)
		);
	}

	if (
		!(typeof body.username === "string") ||
		!(typeof body.password === "string")
	) {
		return new AppResponse(
			400,
			new AppResponseBody("Body content is wrong type", true)
		);
	}

	const reqUser: User | null = UserDTO.create(body.username, body.password);

	if (reqUser === null) {
		return new AppResponse(
			400,
			new AppResponseBody(
				"Username must be 3-15 symbols (A-Z, a-z, 0-9, _) and password must be at least 8 symbols",
				true
			)
		);
	}

	if (event.httpMethod === "POST") {
		const isLogin: string | undefined = event.headers["x-login"];
		if (
			isLogin === undefined ||
			(isLogin !== "true" && isLogin !== "false")
		) {
			return new AppResponse(
				400,
				new AppResponseBody("Request is missing X-Login header", true)
			);
		}
		if (isLogin === "true") {
			const collection: Collection<User> = await AppDatabase.collection(
				"user"
			);
			const dbUser: User | null = await collection.findOne({
				username: reqUser.username,
			});

			if (!dbUser) {
				return new AppResponse(
					400,
					new AppResponseBody(
						"No user with that username exists",
						true
					)
				);
			}

			try {
				const match: boolean = await bcrypt.compare(
					reqUser.password,
					dbUser.password
				);
				if (!match) {
					return new AppResponse(
						400,
						new AppResponseBody("Wrong password", true)
					);
				}
			} catch (error) {
				return new AppResponse(
					500,
					new AppResponseBody(`Unexpected error: ${error}`, true)
				);
			}

			let id: ObjectId | undefined = undefined;
			if (dbUser._id !== undefined) {
				id = dbUser._id;
			}

			const token: string = jwt.sign(
				{
					username: dbUser.username,
					id,
				},
				process.env.JWT_SECRET
			);

			return new AppResponse(
				200,
				new AppResponseBody("Logged in", false, { token })
			);
		} else {
			const collection: Collection<User> = await AppDatabase.collection(
				"user"
			);
			const dbUser: User | null = await collection.findOne({
				username: reqUser.username,
			});

			if (dbUser) {
				return new AppResponse(
					400,
					new AppResponseBody("User already exists", true)
				);
			}

			try {
				reqUser.password = await bcrypt.hash(reqUser.password, 10);
				collection.insertOne(reqUser);
			} catch (error) {
				return new AppResponse(
					500,
					new AppResponseBody(`Unexpected error: ${error}`, true)
				);
			}

			return new AppResponse(
				200,
				new AppResponseBody(`User ${reqUser.username} registered`)
			);
		}
	} else if (event.httpMethod === "DELETE") {
		const token: string | undefined = event.headers["authorization"];
		if (token === undefined) {
			return new AppResponse(
				400,
				new AppResponseBody("Missing authorization header", true)
			);
		}

		try {
			const payload: string | JwtPayload = jwt.verify(
				token,
				process.env.JWT_SECRET
			);
			if (
				reqUser.username !== payload["username"] ||
				!ObjectId.isValid(payload["id"])
			) {
				return new AppResponse(
					400,
					new AppResponseBody("Invalid token", true)
				);
			}
		} catch (error) {
			if (
				error instanceof JsonWebTokenError &&
				error.message === "jwt malformed"
			) {
				return new AppResponse(
					400,
					new AppResponseBody("Invalid token payload", true)
				);
			}
			return new AppResponse(
				500,
				new AppResponseBody(`Unexpected error: ${error}`, true)
			);
		}

		const collection: Collection<User> = await AppDatabase.collection(
			"user"
		);
		const dbUser: User | null = await collection.findOne({
			username: reqUser.username,
		});

		if (!dbUser) {
			return new AppResponse(
				400,
				new AppResponseBody("User doesn't exist", true)
			);
		}

		try {
			const match: boolean = await bcrypt.compare(
				reqUser.password,
				dbUser.password
			);
			if (!match) {
				return new AppResponse(
					400,
					new AppResponseBody("Wrong password", true)
				);
			}
		} catch (error) {
			return new AppResponse(
				500,
				new AppResponseBody(`Unexpected error: ${error}`, true)
			);
		}

		collection.deleteOne({ username: reqUser.username });
		return new AppResponse(
			200,
			new AppResponseBody(`User ${reqUser.username} deleted`)
		);
	} else {
		return new AppResponse(
			405,
			new AppResponseBody("Invalid HTTP method", true)
		);
	}
}
