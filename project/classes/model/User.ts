import { WithId } from "mongodb";
import { z } from "zod";

export const UserSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(15)
		.regex(/^[a-zA-Z]+$/),
	password: z.string().min(8),
});

export type User = z.infer<typeof UserSchema>;

export type Admin = WithId<Omit<User, "password">>;
