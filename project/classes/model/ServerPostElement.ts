import { z } from "zod";

export const ServerPostElementSchema = z.array(z.number()).length(3);

export type ServerPostElement = z.infer<typeof ServerPostElementSchema>;
