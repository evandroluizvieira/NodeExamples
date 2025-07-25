import dotenv from 'dotenv';
dotenv.config(
	{
		quiet: true
	}
);

import buildApp from './source/app.js';

async function startServer() {
	try {
		const app = await buildApp();
		app.listen(
			{
				host: process.env.SERVER_HOST,
				port: process.env.SERVER_PORT
			},
			(error, address) => {
				if (error) {
					console.error(error);
					process.exit(1);
				}
				console.log(`Server running in: ${address}`);
			}
		);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

startServer();