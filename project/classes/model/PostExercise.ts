import Exercise from "./Exercise";

export default class PostExercise {
	exercise: Exercise;
	sets: number;
	repetitions: number;
	intensity?: number;

	constructor(
		exercise: Exercise,
		sets: number,
		repetitions: number,
		intensity?: number
	) {
		this.exercise = exercise;
		this.sets = sets;
		this.repetitions = repetitions;
		if (intensity !== undefined) {
			this.intensity = intensity;
		}
	}
}
