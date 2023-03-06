import { describe, expect, test } from "vitest";
import UserDTO from "../classes/dto/UserDTO";
import User from "../classes/model/User";

describe("Username regex", () => {
	test("#1 - empty", () => {
		const user: User | null = UserDTO.create("", "");
		expect(user).toBeNull();
	});
	test("#2 - too short", () => {
		const user: User | null = UserDTO.create("te", "password");
		expect(user).toBeNull();
	});
	test("#3 - too long", () => {
		const user: User | null = UserDTO.create(
			"testusertestuser",
			"password"
		);
		expect(user).toBeNull();
	});
	test("#4 - invalid symbols", () => {
		const user: User | null = UserDTO.create("test#user¤", "password");
		expect(user).toBeNull();
	});
	test("#5 - invalid first symbol", () => {
		const user: User | null = UserDTO.create("_testuser", "password");
		expect(user).toBeNull();
	});
	test("#6 - multiple errors", () => {
		const user: User | null = UserDTO.create(
			"9test#userTESTUSER",
			"password"
		);
		expect(user).toBeNull();
	});
	test("#7 - valid", () => {
		const user: User | null = UserDTO.create("Testuser", "password");
		expect(user).toBeInstanceOf(User);
	});
});
describe("Password regex", () => {
	test("#1 - empty", () => {
		const user: User | null = UserDTO.create("testuser", "");
		expect(user).toBeNull();
	});
	test("#2 - too short", () => {
		const user: User | null = UserDTO.create("testuser", "passwor");
		expect(user).toBeNull();
	});
	test("#3 - valid", () => {
		const user: User | null = UserDTO.create("testuser", "password");
		expect(user).toBeInstanceOf(User);
	});
});
