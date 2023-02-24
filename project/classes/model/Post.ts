import { ObjectId } from "mongodb";
import PostExercise from "./PostExercise";
import PostExerciseDTO from "../PostExerciseDTO";

export default class Post {
	ID: number;
	userID: ObjectId;
	content: Array<PostExercise>;

	constructor(ID: number, userID: ObjectId, content: string) {
		this.ID = ID;
		this.userID = userID;
		const contentData: Array<string> = content.split(",");
		this.content = contentData.map((value) => {
			return PostExerciseDTO.deserialize(value);
		});
	}
}
