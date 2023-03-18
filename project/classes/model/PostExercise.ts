/**
 * Number range rules enforced in `PostExerciseDTO.ts`.
 */
export default class PostExercise {
	/**
	 * @param eID
	 * ID from Exercise collection.
	 */
	eID: number;
	/**
	 * @param sets
	 * Number between 1 and 25.
	 */
	sets: number;
	/**
	 * @param reps
	 * Number between 1 and 50.
	 */
	reps: number;
	/**
	 * @param RPE
	 * Rated perceived exertion, number between 1 and 10.
	 */
	RPE?: number;

	constructor(eID: number, sets: number, reps: number, RPE?: number) {
		this.eID = eID;
		this.sets = sets;
		this.reps = reps;
		if (RPE !== undefined) {
			this.RPE = RPE;
		}
	}
}
