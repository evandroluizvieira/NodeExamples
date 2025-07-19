import ClientMongoDB from './ClientMongoDB.js';

export const DatabaseTypes = Object.freeze(
	{
		MongoDB: 'mongodb',
	}
);

export async function createDatabaseClient(dbType) {
	switch (dbType) {
		case DatabaseTypes.MongoDB: {
			const uri = process.env.MONGODB_URI;
			const dbName = process.env.DB_NAME;

			if (!uri) {
				throw new Error('MONGODB_URI environment variable is missing');
			}
			
			if (!dbName) {
				throw new Error('DB_NAME environment variable is missing.');
			}

			const client = new ClientMongoDB(uri);
			await client.connect({ dbName });
			return client;
		}
		default: {
			throw new Error(`Unsupported DB_TYPE provided: ${dbType}`);
		}
	}
}
