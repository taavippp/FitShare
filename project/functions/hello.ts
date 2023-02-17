import { HandlerEvent, HandlerContext, Handler } from "@netlify/functions";
import AppResponse from "@/../../classes/AppResponse";

// If everything is set up correctly, this function should be accessible from
// http://localhost:8888/.netlify/functions/hello

export const handler: Handler = async (
	event: HandlerEvent,
	context: HandlerContext
) => {
	return {
		statusCode: 200,
		body: new AppResponse("Hello mom!", false).toString(),
		headers: {
			"Content-Type": "application/json",
		},
	};
};
