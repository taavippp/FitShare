import { ClientPostElementExercise } from "../model/ClientPostElement";
import { ServerPostElement } from "../model/ServerPostElement";

export default class PostDTO {
	static serializeExercise(
		exercise: ClientPostElementExercise
	): ServerPostElement {
		return [exercise.id, exercise.sets, exercise.reps];
	}

	static deserializeExercise(
		exercise: ServerPostElement
	): Omit<ClientPostElementExercise, "name"> {
		return {
			id: exercise[0],
			sets: exercise[1],
			reps: exercise[2],
		};
	}
}
