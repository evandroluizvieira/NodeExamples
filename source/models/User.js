import UserMongoDB from './UserMongoDB.js';
import ClientMongoDB from '../database/ClientMongoDB.js';

export default class User {
	#user;

	constructor(client) {
		if (!client) {
			throw new Error('Client is required');
		}

		switch (true) {
			case client instanceof ClientMongoDB:
				this.#user = new UserMongoDB(client);
				break;
			default:
				throw new Error(`Unsupported client type: ${client.constructor.name}`);
		}

		return new Proxy(
			this,
			{
				get(targetObject, propertyName) {
					if (propertyName in targetObject) {
						return targetObject[propertyName];
					}
					const value = targetObject.#user[propertyName];
					if (typeof value === 'function') {
						return value.bind(targetObject.#user);
					}
					return value;
				},
				set(targetObject, propertyName, value) {
					if (propertyName in targetObject) {
						targetObject[propertyName] = value;
						return true;
					}
					targetObject.#user[propertyName] = value;
					return true;
				}
			}
		);
	}
}
