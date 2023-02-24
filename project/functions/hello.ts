import { HandlerEvent } from "@netlify/functions";
import { AppResponse, AppResponseBody } from "@/../../classes/AppResponse";
import { AppDatabase } from "./AppDatabase";
import { Collection, Db, WithId } from "mongodb";
import User from "../classes/User";

// If everything is set up correctly, this function should be accessible from
// http://localhost:8888/api/hello

export async function handler(event: HandlerEvent): Promise<AppResponse> {
	console.log(event.httpMethod);
	const collection: Collection<User> = await AppDatabase.collection("user");
	const user: WithId<User> | null = await collection.findOne();
	if (user !== null) {
		console.log(user.username);
	}
	return new AppResponse(200, new AppResponseBody("Hello world!"));
}
