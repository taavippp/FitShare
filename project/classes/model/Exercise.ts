import { z } from "zod";
import ExerciseCategory from "../ExerciseCategory";

export const ExerciseSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(3),
	categories: z
		.array(z.number().min(1).max(Object.values(ExerciseCategory).length))
		.min(1),
});

export type Exercise = z.infer<typeof ExerciseSchema>;
