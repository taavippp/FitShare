import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import { Collection, Db, Admin, ObjectId } from "mongodb";
import { HandlerEvent } from "@netlify/functions";
import AppDatabase from "../classes/AppDatabase";
import AppResponse from "../classes/AppResponse";
import TokenDTO from "../classes/dto/TokenDTO";
import { JwtPayload } from "jsonwebtoken";

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

			const adminCollection: Collection<Admin> =
				await AppDatabase.collection("admin");
			const admin: Admin | null = await adminCollection.findOne({
				username: payload.username,
			});

			if (!admin || !ObjectId.isValid(payload.id)) {
				return AppResponse.Forbidden("Not admin");
			}

			return AppResponse.Success(new BaseResponseBody(`User is admin`));
		}
	}

	return AppResponse.InvalidMethod;
}
