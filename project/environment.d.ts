declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWT_SECRET: string;
			MONGO_PASS: string;
			MONGO_USER: string;
			DEV_DATABASE: string;
			PROD_DATABASE: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
