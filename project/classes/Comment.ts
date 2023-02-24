import { ObjectId } from "mongodb";

export default class Comment {
	postID: ObjectId;
	userID: ObjectId;
	text: string;

	constructor(postID: ObjectId, userID: ObjectId, text: string) {
		this.postID = postID;
		this.userID = userID;
		this.text = text;
	}
}
