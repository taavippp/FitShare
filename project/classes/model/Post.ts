import { ObjectId } from "mongodb";
import CountedModel from "../CountedModel";

export default class Post implements CountedModel {
	_id?: string;
	title: string;
	userID?: ObjectId;
	content: Array<Array<number>>;
	timestamp: number;

	constructor(
		title: string,
		content: Array<Array<number>>,
		_id?: string,
		userID?: ObjectId
	) {
		this.title = title as string;
		this.content = content;
		this.timestamp = Date.now();
		if (userID) {
			this.userID = userID;
		}
		if (_id) {
			this._id = _id;
		}
	}
}
