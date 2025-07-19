import { MongoClient, ServerApiVersion } from 'mongodb';
import Client from './Client.js';

export default class ClientMongoDB extends Client {
	#client;
	#db;

	constructor(uri) {
		super();

		if (!uri) {
			throw new Error('MongoDB URI must be provided as a parameter');
		}

		try {
			this.#client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
		} catch (error) {
			throw new Error(`Failed to create MongoDB client: ${error.message}`);
		}

		this.#db = null;
	}
	
	isConnected() {
		return this.#db !== null && this.#client.topology?.isConnected();
	}

	async connect(options = {}) {
		if (!this.#client.topology || !this.#client.topology.isConnected()) {
			await this.#client.connect();
		}

		const dbName = options.dbName;
		if (!dbName) {
			throw new Error('Database name must be provided in options.dbName');
		}

		this.#db = this.#client.db(dbName);
		return true;
	}

	async close() {
		await this.#client.close();
		this.#db = null;
	}

	async query(queryObj) {
		if (!this.isConnected()) {
			throw new Error('MongoDB client not connected');
		}

		const { collection, action, args = [] } = queryObj;
		if (!collection || !action || !Array.isArray(args)) {
			throw new Error('Invalid query object for MongoDB client');
		}

		const collectionRef = this.#db.collection(collection);
		if (typeof collectionRef[action] !== 'function') {
			throw new Error(`Invalid action "${action}" on collection`);
		}

		return await collectionRef[action](...args);
	}

}
