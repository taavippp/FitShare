import { HandlerEvent } from "@netlify/functions";
import { Collection, ObjectId } from "mongodb";
import AppDatabase from "../classes/AppDatabase";
import { AppResponse, AppResponseBody } from "../classes/AppResponse";
import ExerciseCategory from "../classes/ExerciseCategory";
import Exercise from "../classes/model/Exercise";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import Admins from "../public/admins.json";

const ExerciseCategoryKeys = Object.keys(ExerciseCategory);

interface BodyExercise {
	name?: string;
	category?: typeof ExerciseCategory;
}

export async function handler(event: HandlerEvent): Promise<AppResponse> {
	if (event.httpMethod === "GET") {
		const query = event.queryStringParameters;

		if (query === null || query.categories === undefined) {
			return new AppResponse(
				400,
				new AppResponseBody("Missing query parameter", true)
			);
		}
		const queryCategories: Array<string> = query.categories.split(",");
		const categories: Array<number> = [];

		for (let i = 0; i < queryCategories.length; i++) {
			const category: string = queryCategories[i].toUpperCase();
			const index: number = ExerciseCategoryKeys.indexOf(category);
			if (index === -1) {
				return new AppResponse(
					400,
					new AppResponseBody("Invalid category", true)
				);
			}
			categories.push(index);
		}

		console.log(categories);

		const collection: Collection<Exercise> = await AppDatabase.collection(
			"exercise"
		);
		const exercises = await collection
			.find(
				{ category: { $in: categories } },
				{
					projection: {
						category: 0,
					},
				}
			)
			.toArray();
		return new AppResponse(
			200,
			new AppResponseBody(
				`${queryCategories.join(", ")} exercises`,
				false,
				{
					exercises,
				}
			)
		);
	} else if (event.httpMethod === "POST") {
		if (!event.body) {
			return new AppResponse(
				400,
				new AppResponseBody("Request is missing body", true)
			);
		}

		const body: BodyExercise = JSON.parse(event.body);
		if (body.name === undefined || body.category === undefined) {
			return new AppResponse(
				400,
				new AppResponseBody("Missing content in body", true)
			);
		}

		if (
			!(typeof body.name === "string") ||
			!(typeof body.category === "number")
		) {
			return new AppResponse(
				400,
				new AppResponseBody("Body content is wrong type", true)
			);
		}

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
			if (
				!Admins.includes(payload["username"]) ||
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

		const collection: Collection<Exercise> = await AppDatabase.collection(
			"exercise"
		);
		const exercise: Exercise = new Exercise(body.name, body.category);
		exercise._id = await collection.countDocuments({});
		await collection.insertOne(exercise);
		return new AppResponse(
			200,
			new AppResponseBody(`Inserted ${exercise.name}`)
		);
	} else {
		return new AppResponse(
			405,
			new AppResponseBody("Invalid HTTP method", true)
		);
	}
}
