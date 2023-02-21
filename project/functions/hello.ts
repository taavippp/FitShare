import { HandlerEvent, HandlerContext, Handler } from "@netlify/functions";
import { AppResponse, AppResponseBody } from "@/../../classes/AppResponse";

// If everything is set up correctly, this function should be accessible from
// http://localhost:8888/.netlify/functions/hello
// http://localhost:8888/api/hello

export const handler: Handler = async (
	event: HandlerEvent,
	context: HandlerContext
) => {
	return new AppResponse(200, new AppResponseBody("Hello world!"));
};
