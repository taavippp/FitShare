import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET: string = process.env.JWT_SECRET;

export default class TokenDTO {
	static serialize(payload: { [prop: string]: unknown }): string {
		return jwt.sign(payload, SECRET);
	}

	static deserialize(token: string): JwtPayload | null {
		try {
			const payload: JwtPayload | string = jwt.verify(token, SECRET);
			if (typeof payload === "string") {
				return null;
			}
			return payload;
		} catch (error) {
			return null;
		}
	}
}
