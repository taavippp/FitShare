// mongodb has a class called Document which is also implemented in vanilla js
import * as Mongo from "mongodb";

const URI: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@fitshare.ipkqoxl.mongodb.net/?retryWrites=true&w=majority`;

export default class AppDatabase {
	static async connect(dev: boolean = true): Promise<Mongo.Db> {
		const client: Mongo.MongoClient = new Mongo.MongoClient(URI);
		await client.connect();
		const db: Mongo.Db = client.db(
			dev ? process.env.DEV_DATABASE : process.env.PROD_DATABASE
		);
		return db;
	}

	static async collection<Type extends Mongo.Document>(
		name: "user" | "exercise" | "post" | "comment",
		db?: Mongo.Db | undefined,
		dev: boolean = true
	): Promise<Mongo.Collection<Type>> {
		if (db === undefined) {
			db = await AppDatabase.connect(dev);
		}
		return db.collection<Type>(name);
	}
}
