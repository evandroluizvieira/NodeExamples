import UserBase from './UserBase.js';
import { ObjectId } from 'mongodb';

export default class UserMongoDB extends UserBase {
	static Collections = Object.freeze(
		{
			USERS: 'users'
		}
	);

	constructor(client) {
		super(client);
	}

	async create() {
		if (!this.client.isConnected()) {
			throw new Error('Client not connected');
		}

		const existingEmail = await this.client.exists(
			{
				collection: UserMongoDB.Collections.USERS,
				email: this.email
			}
		);

		if (existingEmail) {
			return false;
		}

		const result = await this.client.query(
			{
				collection: UserMongoDB.Collections.USERS,
				action: 'insertOne',
				args: [
					{
						name: this.name,
						email: this.email,
						birthDate: this.birthDate,
						password: this.password
					}
				]
			}
		);

		this._syncData(
			{
				_id: result.insertedId,
				name: this.name,
				email: this.email,
				birthDate: this.birthDate,
				password: this.password
			}
		);

		return result ? result.acknowledged : false;
	}


	async find(criteria = {}) {
		if (!this.client.isConnected()) {
			throw new Error('Client not connected');
		}

		const query = {};

		// Find by id
		if (criteria._id) {
			query._id = criteria._id;
		
		// Find by email and password (default)
		} else if (criteria.email && criteria.password) {
			query.email = criteria.email;
			query.password = criteria.password;
			
		// Find by name, email and birth date (reset password)
		} else if (criteria.name && criteria.email && criteria.birthDate) {
			query.name = criteria.name;
			query.email = criteria.email;
			query.birthDate = criteria.birthDate;
		} else {
			return false;
		}

		const document = await this.client.query(
			{
				collection: UserMongoDB.Collections.USERS,
				action: 'findOne',
				args: [query]
			}
		);

		if (!document) {
			return false;
		}

		this._syncData(document);
		return true;
	}


	async update() {
		if (!this.client.isConnected()) {
			throw new Error('Client not connected');
		}

		const id = this.getID();
		if (!id) {
			throw new Error('Cannot delete: User ID is missing. Ensure the user exists in the database before deleting.');
		}

		const updateFields = {
			name: this.name,
			email: this.email,
			birthDate: this.birthDate,
			password: this.password
		};

		await this.client.query(
			{
				collection: UserMongoDB.Collections.USERS,
				action: 'updateOne',
				args: [
					{
						_id: new ObjectId(id)
					},
					{
						$set: updateFields
					}
				]
			}
		);

		this._syncData(
			{
				_id: id,
				...updateFields
			}
		);

		return true;
	}

	async delete() {
		if (!this.client.isConnected()) {
			throw new Error('Client not connected');
		}

		const id = this.getID();
		if (!id) {
			throw new Error('Cannot delete: User ID is missing. Ensure the user exists in the database before deleting.');
		}

		await this.client.query(
			{
				collection: UserMongoDB.Collections.USERS,
				action: 'deleteOne',
				args: [
					{ _id: new ObjectId(id) }
				]
			}
		);
		
		this._clear();

		return true;
	}
}
