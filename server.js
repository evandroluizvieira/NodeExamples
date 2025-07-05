import app from './source/app.js';
import https from 'https';

const APP_HOST = '0.0.0.0';
const APP_PORT = 3000;

app.listen(
	{
		port: APP_PORT,
		host: APP_HOST
	},
	(error, address) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		const APP_PROTOCOL = app.server instanceof https.Server ? 'https' : 'http';
		console.log(`Servidor rodando em: ${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}`);
	}
);
