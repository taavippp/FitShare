import { HandlerEvent } from "@netlify/functions";
import { AppResponse, AppResponseBody } from "@/../../classes/AppResponse";
import AppDatabase from "../classes/AppDatabase";
import { Collection } from "mongodb";
import User from "../classes/model/User";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

interface BodyUser {
	username: string | unknown | undefined;
	password: string | unknown | undefined;
}

const usernameRegex: RegExp = /^[a-zA-Z]\w{2,14}$/;
const passwordRegex: RegExp = /^.{8,}$/;

// password check failed?
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

	if (!usernameRegex.test(body.username)) {
		return new AppResponse(
			400,
			new AppResponseBody(
				"Username must consist of 3-15 characters and can only include A-Z, numbers and _",
				true
			)
		);
	}

	if (!passwordRegex.test(body.password)) {
		return new AppResponse(
			400,
			new AppResponseBody("Password must be at least 8 characters", true)
		);
	}

	if (event.httpMethod === "GET") {
		const collection: Collection<User> = await AppDatabase.collection(
			"user"
		);
		const user: User | null = await collection.findOne({
			username: body.username,
		});

		if (!user) {
			return new AppResponse(
				400,
				new AppResponseBody("No user with that username exists", true)
			);
		}

		try {
			const match: boolean = await bcrypt.compare(
				body.password,
				user.password
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

		const token: string = jwt.sign(
			{ username: user.username },
			process.env.JWT_SECRET
		);
		return new AppResponse(
			200,
			new AppResponseBody("Logged in", false, { token })
		);
	} else if (event.httpMethod === "POST") {
		const collection: Collection<User> = await AppDatabase.collection(
			"user"
		);
		const user: User | null = await collection.findOne({
			username: body.username,
		});

		if (user) {
			return new AppResponse(
				400,
				new AppResponseBody("User already exists", true)
			);
		}

		try {
			const hash: string = await bcrypt.hash(body.password, 10);
			collection.insertOne(new User(body.username, hash));
		} catch (error) {
			return new AppResponse(
				500,
				new AppResponseBody(`Unexpected error: ${error}`, true)
			);
		}

		return new AppResponse(
			200,
			new AppResponseBody(`User ${body.username} registered`)
		);
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
			if (body.username !== payload["username"]) {
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
		const user: User | null = await collection.findOne({
			username: body.username,
		});

		if (!user) {
			return new AppResponse(
				400,
				new AppResponseBody("User doesn't exist", true)
			);
		}

		try {
			const match: boolean = await bcrypt.compare(
				body.password,
				user.password
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

		collection.deleteOne({ username: body.username });
		return new AppResponse(
			200,
			new AppResponseBody(`User ${body.username} deleted`)
		);
	} else {
		return new AppResponse(
			405,
			new AppResponseBody("Invalid HTTP method", true)
		);
	}
}
