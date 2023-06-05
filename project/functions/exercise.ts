import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import { Exercise, ExerciseSchema } from "../classes/model/Exercise";
import { User, Admin } from "../classes/model/User";
import { Collection, Db, ObjectId } from "mongodb";
import { HandlerEvent } from "@netlify/functions";
import AppDatabase from "../classes/AppDatabase";
import AppResponse from "../classes/AppResponse";
import TokenDTO from "../classes/dto/TokenDTO";
import { JwtPayload } from "jsonwebtoken";

export async function handler(event: HandlerEvent): Promise<BaseResponse> {
	switch (event.httpMethod) {
		case "GET": {
			const query = event.queryStringParameters;

			const db: AppDatabase = await new AppDatabase().connect();
			const collection: Collection<Exercise> = db.collection("exercise");

			if (!query || !query.IDs) {
				const exercises: Array<Exercise> = await collection
					.find(
						{},
						{
							projection: {
								_id: 0,
							},
						}
					)
					.sort({ name: "asc" })
					.toArray();
				await db.close();
				return AppResponse.Success(
					new BaseResponseBody("All exercises", false, {
						exercises,
					})
				);
			}

			const exerciseIDs: Array<number> = query.IDs.split("-").map(
				(num: string) => {
					return parseInt(num);
				}
			);

			for (let ID of exerciseIDs) {
				if (isNaN(ID)) {
					await db.close();
					return AppResponse.InvalidQuery;
				}
			}

			const exercises: Array<Exercise> = await collection
				.find(
					{ id: { $in: exerciseIDs } },
					{
						projection: {
							_id: false,
							categories: false,
						},
					}
				)
				.sort({ name: "asc" })
				.toArray();

			await db.close();
			return AppResponse.Success(
				new BaseResponseBody("Exercises by ID", false, {
					exercises,
				})
			);
		}
		case "POST": {
			if (!event.body) {
				return AppResponse.InvalidBody;
			}

			const body: Exercise = JSON.parse(event.body);

			const { success } = ExerciseSchema.safeParse(body);
			if (!success) {
				return AppResponse.InvalidBody;
			}

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

			if (!admin || !ObjectId.isValid(payload.id)) {
				await db.close();
				return AppResponse.Forbidden("Not admin");
			}

			const collection: Collection<Exercise> = db.collection("exercise");

			const exercise: Exercise = {
				id: (await collection.countDocuments()) + 1,
				name: body.name,
				categories: body.categories,
			};
			await collection.insertOne(exercise);
			await db.close();

			return AppResponse.Success(
				new BaseResponseBody(`Inserted ${exercise.name}`)
			);
		}
	}

	return AppResponse.InvalidMethod;
}
