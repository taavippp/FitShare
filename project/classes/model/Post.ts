import { ObjectId } from "mongodb";
import { z } from "zod";
import { ServerPostElementSchema } from "./ServerPostElement";
import { PostIDSchema } from "./PostID";

export const PostSchema = z.object({
	id: PostIDSchema.optional(),
	title: z.string().min(4).max(64),
	content: z.array(ServerPostElementSchema).min(1).max(32),
	userID: z
		.custom<ObjectId>((userID) => {
			return Buffer.byteLength(userID as string, "utf8") === 12;
		})
		.optional(),
	timestamp: z.number().default(Date.now()).optional(),
});

export type Post = z.infer<typeof PostSchema>;
