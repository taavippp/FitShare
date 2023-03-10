import { ObjectId } from "mongodb";
import CountedModel from "../CountedModel";

export default class Admin implements CountedModel {
	_id: ObjectId;
	username: string;

	constructor(username: string) {
		this.username = username;
	}
}
