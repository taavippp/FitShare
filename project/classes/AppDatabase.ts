// mongodb has a class called Document which is also implemented in vanilla js
import * as Mongo from "mongodb";

export default class AppDatabase {
	private readonly URI: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@fitshare.ipkqoxl.mongodb.net/?retryWrites=true&w=majority`;
	private client: Mongo.MongoClient;
	private db: Mongo.Db;
	private dev: boolean;

	constructor(dev: boolean = true) {
		this.dev = dev;
	}

	async connect(): Promise<AppDatabase> {
		if (this.db) {
			return this;
		}
		this.client = new Mongo.MongoClient(this.URI);
		await this.client.connect();
		this.db = this.client.db(
			this.dev ? process.env.DEV_DATABASE : process.env.PROD_DATABASE
		);
		return this;
	}

	collection<T extends Mongo.Document>(
		name: "user" | "exercise" | "post" | "comment" | "admin"
	): Mongo.Collection<T> {
		return this.db.collection<T>(name);
	}

	async close(): Promise<void> {
		await this.client.close();
	}
}