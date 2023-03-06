import User from "../model/User";

const format: { [property: string]: RegExp } = {
	// start with a-z, A-Z, rest of them a-z, A-Z, 0-9 or _
	// 3-15 symbols
	username: /^[a-zA-Z]\w{2,14}$/,
	// 8 or more symbols
	password: /^.{8,}$/,
};

export default class UserDTO {
	static create(username: string, password: string): User | null {
		if (format.username.test(username) && format.password.test(password)) {
			return new User(username, password);
		}
		return null;
	}
}
