import { z } from "zod";

export const ClientPostElementExerciseSchema = z.object({
	name: z.string(),
	id: z.number(),
	sets: z.number().min(1).max(32),
	reps: z.number().min(1).max(128),
});

export type ClientPostElementExercise = z.infer<
	typeof ClientPostElementExerciseSchema
>;

export const ClientPostElementSchema = z.object({
	editable: z.boolean(),
	exercise: ClientPostElementExerciseSchema,
});

export type ClientPostElement = z.infer<typeof ClientPostElementSchema>;
