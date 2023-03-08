import PostExercise from "../model/PostExercise";

// name sets reps intensity(optional)
export default class PostExerciseDTO {
	static serialize(pe: PostExercise): Array<number> {
		const arr: Array<number> = [pe.exerciseID, pe.sets, pe.repetitions];
		if (pe.intensity !== undefined) {
			arr.push(pe.intensity);
		}
		return arr;
	}

	static deserialize(arr: Array<number>): PostExercise {
		const pe: PostExercise = new PostExercise(arr[0], arr[1], arr[2]);
		if (arr.length === 4) {
			pe.intensity = arr[3];
		}
		return pe;
	}
}
