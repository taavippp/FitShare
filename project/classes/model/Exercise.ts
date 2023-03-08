import CountedModel from "../CountedModel";

export default class Exercise implements CountedModel {
	_id?: number;
	name: string;
	category: number;

	constructor(name: string, category: number) {
		this.name = name;
		this.category = category;
	}
}
