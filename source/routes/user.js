import User 			from '../models/User.js';
import UserMongoDB 		from '../models/UserMongoDB.js';

function alertScript(reply, message) {
	const escaped = message.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
	const script = `<script>alert('${escaped}'); window.location.href = '/';</script>`;
	return reply.type('text/html').send(script);
}

export default async function (app, options) {
	// Register GET
	app.get('/user/register',
		async (request, reply) => {
			return reply.viewWithAutoAssets(
				'user-form', {
					title: 'Register User',
					formAction: '/user/register',
					mode: 'register',
					id: '',
					name: '',
					email: '',
					birthDate: '',
				}
			);
		}
	);

	// Register POST
	app.post('/user/register',
		async (request, reply) => {
			const { name, email, birthDate, password, confirmPassword } = request.body;
			const errors = {};

			if (!name) errors.nameError = 'Name is required.';
			if (!email) errors.emailError = 'Email is required.';
			if (!birthDate) errors.birthDateError = 'Birth date is required.';
			if (!password) errors.passwordError = 'Password is required.';
			if (password !== confirmPassword) errors.confirmPasswordError = 'Passwords do not match.';

			if (email && !errors.emailError) {
				const exists = await app.dbClient.exists({ collection: UserMongoDB.Collections.USERS, email });
				if (exists) errors.emailError = 'Email already registered.';
			}

			if (Object.keys(errors).length > 0) {
				return reply.viewWithAutoAssets(
					'user-form', {
						title: 'Register User',
						formAction: '/user/register',
						mode: 'register',
						name,
						email,
						birthDate,
						...errors,
					}
				);
			}

			try {
				const user = new User(app.dbClient);
				user.name = name;
				user.email = email;
				user.birthDate = birthDate;
				user.password = password;

				const userCreated = await user.create();
				if (userCreated) {
					return reply.redirect('/user/login');
				} else {
					return alertScript(reply, "User not created in database!");
				}
			} catch (error) {
				console.error(error);
				return alertScript(reply, "Error in User::create");
			}
		}
	);


	// Login GET
	app.get('/user/login',
		async (request, reply) => {
			if (!app.user.isEmpty() && app.user.isSynced()) {
				return reply.redirect('/user/profile');
			}
			
			return reply.viewWithAutoAssets(
				'user-form', {
					title: 'Login',
					formAction: '/user/login',
					mode: 'login',
					email: '',
				}
			);
		}
	);
	
	// Login POST
	app.post('/user/login',
		async (request, reply) => {
			if (!app.user.isEmpty()) {
				return reply.redirect('/user/profile');
			}

			const { email, password } = request.body;
			const errors = {};

			if (!email) errors.emailError = 'Email is required.';
			if (!password) errors.passwordError = 'Password is required.';

			if (Object.keys(errors).length > 0) {
				return reply.viewWithAutoAssets(
					'user-form', {
						title: 'Login',
						formAction: '/user/login',
						mode: 'login',
						email,
						...errors,
					}
				);
			}

			try {
				const user = new User(app.dbClient);
				user.email = email;
				user.password = password;

				const found = await user.find({ email, password });
				if (found) {
					app.user = user;
					return reply.redirect('/user/profile');
				} else {
					return alertScript(reply, "User not found in database!");
				}

			} catch (error) {
				return alertScript(reply, "Error in User::find");
			}
		}
	);
	
	// Profile GET
	app.get('/user/profile',
		async (request, reply) => {
			if (app.user.isEmpty() || !app.user.isSynced()) {
				return reply.redirect('/user/login');
			}

			const user = {
				id: app.user.getID(),
				name: app.user.name,
				email: app.user.email,
				birthDate: app.user.birthDate,
			};

			return reply.viewWithAutoAssets(
				'user-form', {
					title: 'User Profile',
					formAction: '/user/delete',
					mode: 'profile',
					...user,
				}
			);
		}
	);
	
	// Logout GET
	app.get('/user/logout',
		async (request, reply) => {
			app.user.clear();
			return reply.redirect('/');
		}
	);
	
	// Delete GET
	app.get('/user/delete',
		async (request, reply) => {
			try {
				return alertScript(
					reply,
					"Are you sure you want to delete your account?", "/user/delete/confirm"
				);
			} catch (error) {
				return alertScript(reply, "Error preparing delete confirmation.");
			}
		}
	);

	app.get('/user/delete/confirm',
		async (request, reply) => {
			try {
				await app.user.delete();
				return reply.redirect('/');
			} catch (error) {
				return alertScript(reply, "Error in User::delete");
			}
		}
	);


	// Reset Password GET
	app.get('/user/reset-password',
		async (request, reply) => {
			return reply.viewWithAutoAssets(
				'user-form', {
					title: 'Reset Password',
					formAction: '/user/reset-password',
					mode: 'reset-password',
					email: '',
				}
			);
		}
	);

	// Reset Password POST
	app.post('/user/reset-password',
		async (request, reply) => {
			const {
				name,
				email,
				birthDate,
				newPassword,
				confirmNewPassword,
			} = request.body;

			const errors = {};

			if (!name) errors.nameError = 'Name is required.';
			if (!email) errors.emailError = 'Email is required.';
			if (!birthDate) errors.birthDateError = 'Birth date is required.';
			if (!newPassword) errors.newPasswordError = 'New password is required.';
			if (newPassword !== confirmNewPassword)
				errors.confirmNewPasswordError = 'Passwords do not match.';

			if (Object.keys(errors).length > 0) {
				return reply.viewWithAutoAssets(
					'user-form', {
						title: 'Reset Password',
						formAction: '/user/reset-password',
						mode: 'reset-password',
						name,
						email,
						birthDate,
						...errors,
					}
				);
			}

			try {
				const document = await app.dbClient.findOne(
					{
						collection: UserMongoDB.Collections.USERS,
						name,
						email,
						birthDate,
					}
				);

				if (!document) {
					return reply.viewWithAutoAssets(
						'user-form', {
							title: 'Reset Password',
							formAction: '/user/reset-password',
							mode: 'reset-password',
							name,
							email,
							birthDate,
							emailError: 'User not found with the provided information.',
						}
					);
				}

				const user = new User(app.dbClient);
				user._syncData(document);

				user.password = newPassword;
				await user.update();

				return reply.redirect('/user/login');
			} catch (error) {
				console.error(error);
				return alertScript(reply, "Error resetting password.");
			}
		}
	);

	// Edit GET
	app.get('/user/edit',
		async (request, reply) => {
			if (app.user.isEmpty() || !app.user.isSynced()) {
				return reply.redirect('/user/login');
			}

			const user = {
				id: app.user.getID(),
				name: app.user.name,
				email: app.user.email,
				birthDate: app.user.birthDate,
			};

			return reply.viewWithAutoAssets(
				'user-form', {
					title: 'Edit User',
					formAction: '/user/edit',
					mode: 'edit',
					...user,
				}
			);
		}
	);

	app.post('/user/edit',
		async (request, reply) => {
			if (app.user.isEmpty() || !app.user.isSynced()) {
				return reply.redirect('/user/login');
			}

			const { name, email, birthDate } = request.body;
			const errors = {};

			if (!name)            errors.nameError = 'Name is required.';
			if (!email)           errors.emailError = 'Email is required.';
			if (!birthDate)       errors.birthDateError = 'Birth date is required.';

			if (!errors.emailError) {
				try {
					const found = await app.dbClient.findOne(
						{
							collection: UserMongoDB.Collections.USERS,
							email,
						}
					);

					if (found && found._id.toString() !== app.user.getID()) {
						errors.emailError = 'Email already registered.';
					}
				} catch (error) {
					return alertScript(reply, 'Error validating email.');
				}
			}

			if (Object.keys(errors).length > 0) {
				return reply.viewWithAutoAssets(
					'user-form', {
						title: 'Edit User',
						formAction: '/user/edit',
						mode: 'edit',
						name,
						email,
						birthDate,
						...errors,
					}
				);
			}

			try {
				app.user.name = name;
				app.user.email = email;
				app.user.birthDate = birthDate;

				await app.user.update();

				return reply.redirect('/user/profile');
			} catch (error) {
				console.error(error);
				return alertScript(reply, "Error updating user.");
			}
		}
	);
}
