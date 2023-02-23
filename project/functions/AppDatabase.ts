import { Db, MongoClient } from "mongodb";

export type CollectionName =
	| "user"
	| "workout"
	| "comment"
	| "exercise"
	| "exercisecategory";

const URI: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@fitshare.ipkqoxl.mongodb.net/?retryWrites=true&w=majority`;

export namespace AppDatabase {
	export const connect = async (dev: boolean = true): Promise<Db> => {
		const client: MongoClient = new MongoClient(URI);
		await client.connect();
		const db: Db = client.db(
			dev ? process.env.DEV_DATABASE : process.env.PROD_DATABASE
		);
		return db;
	};
}
