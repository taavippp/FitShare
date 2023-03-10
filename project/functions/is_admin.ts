import { HandlerEvent } from "@netlify/functions";
import { JwtPayload, JsonWebTokenError } from "jsonwebtoken";
import { Collection, Db, Admin, ObjectId } from "mongodb";
import AppDatabase from "../classes/AppDatabase";
import { AppResponse, AppResponseBody } from "../classes/AppResponse";
import jwt from "jsonwebtoken";

export async function handler(event: HandlerEvent): Promise<AppResponse> {
	if (event.httpMethod === "GET") {
		const token: string | undefined = event.headers.authorization;
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

			const db: Db = await AppDatabase.connect();
			const adminCollection: Collection<Admin> =
				await AppDatabase.collection("admin", db);
			const admin: Admin | null = await adminCollection.findOne({
				username: payload["username"],
			});

			if (admin === null || !ObjectId.isValid(payload["id"])) {
				return new AppResponse(
					400,
					new AppResponseBody("Invalid token or not admin", true)
				);
			}

			return new AppResponse(
				200,
				new AppResponseBody(`${payload["username"]} is admin`)
			);
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
	} else {
		return new AppResponse(
			405,
			new AppResponseBody("Invalid HTTP method", true)
		);
	}
}
