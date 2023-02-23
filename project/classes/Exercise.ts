export class ExerciseCategory {
	id: number;
	name: string;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}
}

export default class Exercise {
	id: number;
	name: string;
	category_id: number;

	constructor(id: number, name: string, category_id: number) {
		this.id = id;
		this.name = name;
		this.category_id = category_id;
	}
}
