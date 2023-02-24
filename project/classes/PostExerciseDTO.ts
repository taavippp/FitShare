import Exercise from "./model/Exercise";
import PostExercise from "./model/PostExercise";

// ID sets reps intensity(optional)
export default class PostExerciseDTO {
	static serialize(pe: PostExercise): string {
		const intensity: string =
			pe.intensity === undefined ? `` : ` ${pe.intensity}`;
		return `${pe.exercise.ID} ${pe.sets} ${pe.repetitions}${intensity}`;
	}

	static deserialize(pe: string): PostExercise {
		return new PostExercise(
			new Exercise(-1, "Not implemented", -1),
			-1,
			-1
		);
	}
}
