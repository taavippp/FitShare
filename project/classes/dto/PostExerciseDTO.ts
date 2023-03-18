import PostExercise from "../model/PostExercise";

export default class PostExerciseDTO {
	static serialize(pe: PostExercise): Array<number | null> {
		const arr: Array<number | null> = [pe.eID];
		pe.sets >= 1 && pe.sets <= 25 ? arr.push(pe.sets) : arr.push(null);
		pe.reps >= 1 && pe.reps <= 50 ? arr.push(pe.reps) : arr.push(null);
		if (pe.RPE !== undefined) {
			pe.RPE >= 1 && pe.RPE <= 10 ? arr.push(pe.RPE) : arr.push(null);
		}
		return arr;
	}

	static deserialize(arr: Array<number>): PostExercise {
		const pe: PostExercise = new PostExercise(arr[0], arr[1], arr[2]);
		if (arr.length === 4) {
			pe.RPE = arr[3];
		}
		return pe;
	}
}
