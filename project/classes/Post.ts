import { ObjectId } from "mongodb";
import PostExercise from "./PostExercise";
import PostExerciseDTO from "./PostExerciseDTO";

export default class Post {
	userID: ObjectId;
	content: Array<PostExercise>;

	constructor(userID: ObjectId, content: string) {
		this.userID = userID;
		const contentData: Array<string> = content.split(",");
		this.content = contentData.map((value) => {
			return PostExerciseDTO.deserialize(value);
		});
	}
}
