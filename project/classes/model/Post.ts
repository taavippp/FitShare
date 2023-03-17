import { ObjectId } from "mongodb";
import CountedModel from "../CountedModel";
import PostExercise from "./PostExercise";

export default class Post implements CountedModel {
	_id: string;
	title: string;
	userID: ObjectId;
	content: Array<PostExercise>;

	constructor(
		_id: string,
		title: string,
		userID: ObjectId,
		content: Array<PostExercise>
	) {
		this.title = title;
		this.userID = userID;
		this.content = content;
	}
}
