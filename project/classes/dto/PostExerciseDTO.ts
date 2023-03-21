import PostExercise from "../model/PostExercise";

export default class PostExerciseDTO {
	static serialize(pe: PostExercise): Array<number | null> {
		const arr: Array<number | null> = [pe.eID];
		pe.sets >= 1 && pe.sets <= 25 ? arr.push(pe.sets) : arr.push(null);
		pe.reps >= 1 && pe.reps <= 50 ? arr.push(pe.reps) : arr.push(null);
		return arr;
	}

	static deserialize(arr: Array<number>): PostExercise {
		return new PostExercise(arr[0], arr[1], arr[2]);
	}
}
