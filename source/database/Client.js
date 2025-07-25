export default class Client {
	constructor() {
		if (new.target === Client) {
			throw new TypeError('Cannot instantiate abstract Client directly');
		}
	}
	
	isConnected() {
		throw new Error('isConnected() must be implemented');
	}

	async connect(options = {}) {
		throw new Error('connect() must be implemented');
	}

	async close() {
		throw new Error('close() must be implemented');
	}

	async query(queryObj, params = []) {
		throw new Error('query() must be implemented');
	}
}
