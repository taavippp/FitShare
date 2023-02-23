import { ObjectId } from "mongodb";

export default class Workout {
	user_id: ObjectId;
	content: string;
}
