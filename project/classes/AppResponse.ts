export default class AppResponse {
	message: string;
	error: boolean = false;
	obj?: object | undefined;

	constructor(message: string, error?: boolean, obj?: object) {
		this.message = message;
		if (error !== undefined) {
			this.error = error;
		}
		if (obj !== undefined) {
			this.obj = obj;
		}
	}

	toString(): string {
		return JSON.stringify(this);
	}
}
