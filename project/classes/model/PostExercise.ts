export default class PostExercise {
	exerciseID: number;
	sets: number;
	repetitions: number;
	intensity?: number;

	constructor(
		exerciseID: number,
		sets: number,
		repetitions: number,
		intensity?: number
	) {
		this.exerciseID = exerciseID;
		this.sets = sets;
		this.repetitions = repetitions;
		if (intensity !== undefined) {
			this.intensity = intensity;
		}
	}
}
