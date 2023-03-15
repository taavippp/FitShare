type PropertyType = "string" | "number" | "boolean" | "object";

export default class DataValidator {
	static isValid(
		data: Object,
		type: { [property: string]: PropertyType }
	): boolean {
		const properties: Array<string> = Object.keys(type);
		const checked: Array<string> = [];
		for (let i = 0; i < properties.length; i++) {
			const property = properties[i];

			if (checked.includes(property)) {
				continue;
			}

			if (!data[property] || typeof data[property] !== type[property]) {
				return false;
			}

			// JSON.parse parses arrays as objects
			if (type[property] === "object" && "length" in data[property]) {
				if (data[property].length === 0) {
					return false;
				}
				const arrayProperty = `${property}_element`;
				if (
					!data[property][0] ||
					typeof data[property][0] !== type[arrayProperty]
				) {
					return false;
				}
				checked.push(arrayProperty);
			}

			checked.push(property);
		}
		return true;
	}
}
