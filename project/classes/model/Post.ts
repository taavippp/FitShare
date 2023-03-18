import { ObjectId } from "mongodb";
import CountedModel from "../CountedModel";
import PostExercise from "./PostExercise";

export default class Post implements CountedModel {
	_id: string;
	title: string;
	userID: ObjectId;
	content: Array<PostExercise>;

	constructor(
		title: string,
		content: Array<PostExercise>,
		_id?: string,
		userID?: ObjectId
	) {
		this.title = title as string;
		this.content = content;
		if (userID) {
			this.userID = userID;
		}
		if (_id) {
			this._id = _id;
		}
	}
}
