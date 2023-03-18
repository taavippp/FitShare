import { describe, test, expect } from "vitest";
import PostExerciseDTO from "../classes/dto/PostExerciseDTO";
import PostExercise from "../classes/model/PostExercise";

function isValidArray(arr: Array<number | null>): boolean {
	for (let i = 0; i < arr.length; i++) {
		const num: number | null = arr[i];
		if (!num) {
			return false;
		}
	}
	return true;
}

describe("PostExerciseDTO tests", () => {
	let pe: PostExercise;
	let result: boolean;
	test("Failing cases", () => {
		// sets is too low
		pe = new PostExercise(123, 0, 10);
		result = isValidArray(PostExerciseDTO.serialize(pe));
		expect(result).toBeFalsy();

		// sets is too high
		pe = new PostExercise(123, 26, 10);
		result = isValidArray(PostExerciseDTO.serialize(pe));
		expect(result).toBeFalsy();

		// reps is too low
		pe = new PostExercise(123, 10, -1);
		result = isValidArray(PostExerciseDTO.serialize(pe));
		expect(result).toBeFalsy();

		// reps is too high
		pe = new PostExercise(123, 10, 100);
		result = isValidArray(PostExerciseDTO.serialize(pe));
		expect(result).toBeFalsy();

		// RPE is too low
		pe = new PostExercise(123, 10, 25, 0);
		result = isValidArray(PostExerciseDTO.serialize(pe));
		expect(result).toBeFalsy();

		// RPE is too high
		pe = new PostExercise(123, 10, 25, 11);
		result = isValidArray(PostExerciseDTO.serialize(pe));
		expect(result).toBeFalsy();
	});

	test("Passing cases", () => {
		pe = new PostExercise(123, 1, 1, 10);
		result = isValidArray(PostExerciseDTO.serialize(pe));
		expect(result).toBeTruthy();

		pe = new PostExercise(123, 25, 50, 1);
		result = isValidArray(PostExerciseDTO.serialize(pe));
		expect(result).toBeTruthy();
	});
});
