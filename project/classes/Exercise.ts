export default class Exercise {
	id: number;
	name: string;
	categoryID: number;

	constructor(id: number, name: string, categoryID: number) {
		this.id = id;
		this.name = name;
		this.categoryID = categoryID;
	}
}
