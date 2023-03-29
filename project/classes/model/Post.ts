import { ObjectId } from "mongodb";
import { z } from "zod";
import { ServerPostElementSchema } from "./ServerPostElement";

export const PostIDSchema = z.string().min(9).optional();

export const PostSchema = z.object({
	id: PostIDSchema,
	title: z.string().min(4).max(64),
	content: z.array(ServerPostElementSchema).min(1).max(32),
	userID: z
		.custom<ObjectId>((userID) => {
			return ObjectId.isValid(userID as string);
		})
		.optional(),
	timestamp: z.number().default(Date.now()).optional(),
});

export type Post = z.infer<typeof PostSchema>;
