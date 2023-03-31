import { z } from "zod";

export const PostIDSchema = z
	.string()
	.min(9)
	.regex(/^[a-z0-9]{9,}$/);
