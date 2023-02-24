import { HandlerEvent } from "@netlify/functions";
import { AppResponse, AppResponseBody } from "@/../../classes/AppResponse";
import AppDatabase from "../classes/AppDatabase";
import { Collection } from "mongodb";
import User from "../classes/model/User";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

interface BodyUser {
	username: string | undefined;
	password: string | undefined;
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

		bcrypt.compare(
			body.password,
			user.password,
			(error: Error | undefined, match: boolean) => {
				if (error) {
					return new AppResponse(
						500,
						new AppResponseBody(`Unexpected error: ${error}`, true)
					);
				}
				if (!match) {
					return new AppResponse(
						400,
						new AppResponseBody("Wrong password", true)
					);
				}
			}
		);
		const token = jwt.sign(user.username, process.env.JWT_SECRET);
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
		bcrypt.hash(
			body.password,
			10,
			(error: Error | undefined, hash: string) => {
				if (error) {
					return new AppResponse(
						500,
						new AppResponseBody(`Unexpected error: ${error}`, true)
					);
				}
				// @ts-ignore
				// already checked whether username is undefined
				collection.insertOne(new User(body.username, hash));
			}
		);
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
		jwt.verify(
			token,
			process.env.JWT_SECRET,
			(
				error: VerifyErrors | null,
				json: string | JwtPayload | undefined
			) => {
				if (error) {
					return new AppResponse(
						500,
						new AppResponseBody(`Unexpected error: ${error}`, true)
					);
				}
				// NOT SURE
			}
		);

		const collection: Collection<User> = await AppDatabase.collection(
			"user"
		);
		const user: User | null = await collection.findOne({
			username: body.username,
		});
		if (!user) {
			return new AppResponse(
				400,
				new AppResponseBody("User doesn't exist")
			);
		}
	} else {
		return new AppResponse(
			405,
			new AppResponseBody("Invalid HTTP method", true)
		);
	}
}
