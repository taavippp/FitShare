import { ObjectId } from "mongodb";

export default class Comment {
	postID: string;
	userID: ObjectId;
	text: string;

	constructor(postID: string, userID: ObjectId, text: string) {
		this.postID = postID;
		this.userID = userID;
		this.text = text;
	}
}
