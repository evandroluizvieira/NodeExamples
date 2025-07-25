export default class UserBase {
	#idDB = '';
	#nameDB = '';
	#emailDB = '';
	#birthDateDB = '';
	#passwordDB = '';

	name = '';
	email = '';
	birthDate = '';
	password = '';

	constructor(client) {
		if (new.target === UserBase) {
			throw new TypeError('Cannot instantiate abstract UserBase directly');
		}
		this.client = client;
	}

	async create() {
		throw new Error('create() must be implemented');
	}

	async find(criteria = {}) {
		throw new Error('find() must be implemented');
	}

	async update() {
		throw new Error('update() must be implemented');
	}

	async delete() {
		throw new Error('delete() must be implemented');
	}
	

	getID() {
		return this.#idDB;
	}
	
	isEmpty() {
		return (
			!this.name ||
			!this.email ||
			!this.birthDate ||
			!this.password
		);
	}
	
	clear() {
		this.name = '';
		this.email = '';
		this.birthDate = '';
		this.password = '';
	}
	
	isSynced() {
		return (
			this.name === this.#nameDB &&
			this.email === this.#emailDB &&
			this.birthDate === this.#birthDateDB &&
			this.password === this.#passwordDB
		);
	}

	// protected:
	_clear() {
		this.clear();
		this.#idDB = '';
		this.#nameDB = '';
		this.#emailDB = '';
		this.#birthDateDB = '';
		this.#passwordDB = '';
	}
	
	_syncData(dbData) {
		this.#idDB = dbData._id || '';
		this.#nameDB = dbData.name || '';
		this.#emailDB = dbData.email || '';
		this.#birthDateDB = dbData.birthDate || '';
		this.#passwordDB = dbData.password || '';

		this.name = this.#nameDB;
		this.email = this.#emailDB;
		this.birthDate = this.#birthDateDB;
		this.password = this.#passwordDB;
	}
}
