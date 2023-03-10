import CountedModel from "../CountedModel";

export default class Exercise implements CountedModel {
	_id?: number;
	name: string;
	categories: Array<number>;

	constructor(name: string, categories: Array<number>) {
		this.name = name;
		this.categories = categories;
	}
}
