import { BaseResponse, BaseResponseBody } from "../classes/BaseResponse";
import ExerciseCategory from "../classes/ExerciseCategory";
import DataValidator from "../classes/DataValidator";
import { Collection, Db, ObjectId } from "mongodb";
import { HandlerEvent } from "@netlify/functions";
import AppDatabase from "../classes/AppDatabase";
import AppResponse from "../classes/AppResponse";
import Exercise from "../classes/model/Exercise";
import TokenDTO from "../classes/dto/TokenDTO";
import Admin from "../classes/model/Admin";
import { JwtPayload } from "jsonwebtoken";
import User from "../classes/model/User";

const ExerciseCategoryKeys = Object.keys(ExerciseCategory);

type BodyExercise = Omit<Exercise, "_id">;

export async function handler(event: HandlerEvent): Promise<BaseResponse> {
	switch (event.httpMethod) {
		case "GET": {
			const query = event.queryStringParameters;

			if (!query || !query.categories) {
				return AppResponse.InvalidQuery;
			}
			const queryCategories: Array<string> = query.categories.split(",");
			const numCategories: Array<number> = [];

			for (let i = 0; i < queryCategories.length; i++) {
				const category: string = queryCategories[i].toUpperCase();
				const index: number = ExerciseCategoryKeys.indexOf(category);
				if (index === -1) {
					return new BaseResponse(
						400,
						new BaseResponseBody("Invalid category", true)
					);
				}
				numCategories.push(index);
			}

			const collection: Collection<Exercise> =
				await AppDatabase.collection("exercise");
			const exercises: Array<Required<Exercise>> = await collection
				.find(
					{ category: { $in: numCategories } },
					{
						// fetches exercises without "category" property as it is unnecessary
						projection: {
							category: 0,
						},
					}
				)
				.toArray();
			return AppResponse.Success(
				new BaseResponseBody(
					`${queryCategories.join(", ")} exercises`,
					false,
					{
						exercises,
					}
				)
			);
		}
		case "POST": {
			if (!event.body) {
				return AppResponse.InvalidBody;
			}

			const body: BodyExercise = JSON.parse(event.body);
			if (
				!DataValidator.isObjectValid(body, {
					name: "string",
					categories: "object",
					categories$1: "number",
				})
			) {
				return AppResponse.InvalidBody;
			}

			if (
				Math.max(...body.categories) > ExerciseCategoryKeys.length ||
				Math.min(...body.categories) < 0
			) {
				return AppResponse.BadRequest("Invalid exercise category");
			}

			const token: string | undefined = event.headers.authorization;
			if (!token) {
				return AppResponse.MissingAuth;
			}

			const payload: JwtPayload | null = TokenDTO.deserialize(token);
			if (!payload) {
				return AppResponse.UnreadableToken;
			}

			const db: Db = await AppDatabase.connect();
			const userCollection: Collection<User> =
				await AppDatabase.collection("user", db);
			const user: User | null = await userCollection.findOne({
				username: payload.username,
			});

			if (!user) {
				return AppResponse.BadRequest("User doesn't exist");
			}

			const adminCollection: Collection<Admin> =
				await AppDatabase.collection("admin", db);
			const admin: Admin | null = await adminCollection.findOne({
				username: payload.username,
			});

			if (!admin || !ObjectId.isValid(payload.id)) {
				return AppResponse.Forbidden("Not admin");
			}

			const collection: Collection<Exercise> =
				await AppDatabase.collection("exercise", db);

			const exercise: Exercise = new Exercise(body.name, body.categories);
			exercise._id = await collection.countDocuments({});
			await collection.insertOne(exercise);

			return AppResponse.Success(
				new BaseResponseBody(`Inserted ${exercise.name}`)
			);
		}
	}

	return AppResponse.InvalidMethod;
}
