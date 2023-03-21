type PropertyType = "string" | "number" | "boolean" | "object";

export default class DataValidator {
	/**
	 * @param type.property
	 * If property is an array, the property type is `"object"`.
	 * Children of the array should be marked with `name$1`.
	 * If the children of the array have further children, use `name$depth`, where `depth` is an integer.
	 */
	public static isObjectValid(
		object: Object,
		types: { [property: string]: PropertyType }
	): boolean {
		const keys: Array<string> = Object.keys(types);
		let isValid: boolean = true;
		for (let i = 0; i < keys.length; i++) {
			const key: string = keys[i];
			const type: PropertyType = types[key];
			const value: any = DataValidator.getValue(object, key);
			if (!value || typeof value !== type) {
				isValid = false;
			}
			if (!isValid) console.log(key);
		}
		return isValid;
	}

	private static getValue(object: any, key: string): any {
		const len: number = key.length;
		const trimmed: string = key.replace(/\$\d/, "");
		if (!(trimmed in object)) {
			return null;
		}
		if (key[len - 2] === "$") {
			const depth: number = parseInt(key[len - 1]);
			let value: Array<any> = object[trimmed];
			if (!Array.isArray(value)) {
				return null;
			}
			for (let i = 0; i < depth - 1; i++) {
				value = value[0];
			}
			const set: Set<string> = new Set();
			value.map(function (value: unknown) {
				set.add(typeof value);
			});
			if (set.size !== 1) {
				return null;
			}
			return value[0];
		}
		return object[key];
	}
}
