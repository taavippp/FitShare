import { PostIDSchema } from "./PostID";
import { ObjectId } from "mongodb";
import { z } from "zod";

const BaseCommentSchema = z.object({
	postID: PostIDSchema,
	text: z.string().min(1).max(128),
	timestamp: z.number().default(Date.now()).optional(),
});

export const ServerCommentSchema = BaseCommentSchema.extend({
	userID: z.custom<ObjectId>((userID) => {
		return ObjectId.isValid(userID as string);
	}),
});

export const ClientCommentSchema = BaseCommentSchema.extend({
	username: z
		.string()
		.min(3)
		.max(15)
		.regex(/^[a-zA-Z]+$/),
});

export type ServerComment = z.infer<typeof ServerCommentSchema>;
export type ClientComment = z.infer<typeof ClientCommentSchema>;
