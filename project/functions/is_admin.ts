import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import { Collection, ObjectId } from "mongodb";
import { HandlerEvent } from "@netlify/functions";
import AppDatabase from "../classes/AppDatabase";
import AppResponse from "../classes/AppResponse";
import TokenDTO from "../classes/dto/TokenDTO";
import { JwtPayload } from "jsonwebtoken";
import { Admin } from "../classes/model/User";

export async function handler(event: HandlerEvent): Promise<BaseResponse> {
	switch (event.httpMethod) {
		case "GET": {
			const token: string | undefined = event.headers.authorization;
			if (!token) {
				return AppResponse.MissingAuth;
			}

			const payload: JwtPayload | null = TokenDTO.deserialize(token);
			if (!payload) {
				return AppResponse.UnreadableToken;
			}

			const db: AppDatabase = await new AppDatabase().connect();
			const adminCollection: Collection<Admin> = db.collection("admin");
			const admin: Admin | null = await adminCollection.findOne({
				username: payload.username,
			});
			await db.close();

			if (!admin || !ObjectId.isValid(payload.id)) {
				return AppResponse.Forbidden("Not admin");
			}

			return AppResponse.Success(new BaseResponseBody(`User is admin`));
		}
	}

	return AppResponse.InvalidMethod;
}
