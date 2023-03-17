import { ObjectId } from "mongodb";

export default interface CountedModel {
	_id?: number | ObjectId | string;
}
