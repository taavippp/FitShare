import PostExercise from "./PostExercise";

export default class PostExerciseDTO {
	static serialize(pe: PostExercise): string {
		const intensity: string =
			pe.intensity === undefined ? `` : ` ${pe.intensity}`;
		return `${pe.exercise.id} ${pe.sets} ${pe.exercise}${intensity}`;
	}

	static deserialize(pe: string): PostExercise {
		const peData: Array<string> = pe.split(" ");
		const hasIntensity: boolean = peData.length === 4;
		if (hasIntensity) {
			return new PostExercise();
		}
		return new PostExercise();
	}
}
