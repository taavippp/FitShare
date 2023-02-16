import { HandlerEvent, HandlerContext, Handler } from "@netlify/functions";

// If everything is set up correctly, this function should be accessible from
// http://localhost:8888/.netlify/functions/hello

const handler: Handler = async (
	event: HandlerEvent,
	context: HandlerContext
) => {
	return {
		statusCode: 200,
		body: JSON.stringify({ message: "Hello mold" }),
		headers: {
			"Content-Type": "application/json",
		},
	};
};

export { handler };
