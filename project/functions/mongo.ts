import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import {
	Collection,
	Db,
	Document as MongoDocument,
	InsertOneResult,
	MongoClient,
} from "mongodb";
import { AppResponse, AppResponseBody } from "../classes/AppResponse";
import User from "../classes/User";

export const handler: Handler = async (
	event: HandlerEvent,
	context: HandlerContext
) => {
	const URI: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@fitshare.ipkqoxl.mongodb.net/?retryWrites=true&w=majority`;
	const client: MongoClient = new MongoClient(URI);
	await client.connect();
	const db: Db = client.db(process.env.DEV_DATABASE);
	const collection: Collection<MongoDocument> = db.collection("user");
	const inserted: InsertOneResult<MongoDocument> = await collection.insertOne(
		new User("taavi", "password")
	);
	return new AppResponse(
		200,
		new AppResponseBody(`Inserted ID ${inserted.insertedId}`)
	);
};
