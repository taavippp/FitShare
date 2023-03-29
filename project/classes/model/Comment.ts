import { PostIDSchema } from "./Post";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const CommentSchema = z.object({
	postID: PostIDSchema,
	userID: z.custom<ObjectId>((userID) => {
		return ObjectId.isValid(userID as string);
	}),
	text: z.string().max(128),
});

export type Comment = z.infer<typeof CommentSchema>;
