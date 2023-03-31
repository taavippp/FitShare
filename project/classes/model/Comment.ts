import { PostIDSchema } from "./PostID";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const CommentSchema = z.object({
	postID: PostIDSchema,
	userID: z.custom<ObjectId>((userID) => {
		return ObjectId.isValid(userID as string);
	}),
	text: z.string().min(1).max(128),
	timestamp: z.number().default(Date.now()).optional(),
});

export type AppComment = z.infer<typeof CommentSchema>;
