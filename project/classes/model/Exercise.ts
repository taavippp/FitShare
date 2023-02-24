export default class Exercise {
	ID: number;
	name: string;
	categoryID: number;

	constructor(ID: number, name: string, categoryID: number) {
		this.ID = ID;
		this.name = name;
		this.categoryID = categoryID;
	}
}
