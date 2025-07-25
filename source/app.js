import path				from 'path';
import url				from 'url';
import handlebars		from 'handlebars';
import Fastify			from 'fastify';
import formbody			from '@fastify/formbody';
import view				from '@fastify/view';
import staticPlugin		from '@fastify/static';
import User				from './models/User.js';
import userRoutes		from './routes/user.js';
import homeRoutes		from './routes/home.js';
import {
	createDatabaseClient,
	DatabaseTypes
} from './database/index.js';

export default async function() {
	handlebars.registerHelper(
		'ifEquals',
		function (arg1, arg2, options) {
			if (arg1 == arg2) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		}
	);
	
	handlebars.registerHelper(
		'ifNotEquals',
		function (arg1, arg2, options) {
			if (arg1 != arg2) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		}
	);
	
	handlebars.registerHelper(
		'ifEqualsAny',
		function(arg1, ...args) {
			const options = args.pop();
			const matchesAny = args.some(v => arg1 == v);
			return matchesAny ? options.fn(this) : options.inverse(this);
		}
	);

	handlebars.registerHelper(
		'ifNotEqualsAny',
		function(arg1, ...args) {
			const options = args.pop();
			const isDifferentFromAll = args.every(v => arg1 != v);
			return isDifferentFromAll ? options.fn(this) : options.inverse(this);
		}
	);

	const app = Fastify(
		{
			logger: false
		}
	);
	
	const __filename = url.fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	
	const dbClient = await createDatabaseClient(DatabaseTypes.MongoDB);	
	app.decorate('dbClient', dbClient);
	
	const user = new User(dbClient);	
	app.decorate('user', user);
	
	app.decorateReply(
		'viewWithAutoAssets',
		function (name, data = {}) {

			const cssPath = `/public/styles/${name}.css`;
			const jsPath = `/public/script/${name}.js`;
			
			const viewFile = `pages/${name}`;
			const styleFile = `<link rel="stylesheet" href="${cssPath}" />`;
			const scriptFile = `<script src="${jsPath}"></script>`;

			data.style = styleFile;
			data.script = scriptFile;
			return this.view(viewFile, data);
		}
	);

	app.register(
		staticPlugin,
		{
			root: path.resolve(__dirname, '..', 'public'),
			prefix: '/public/',
		}
	);
	
	app.register(
		view,
		{
			engine:
			{
				handlebars,
			},
			root: path.join(__dirname, '..', 'views'),
			layout: 'layouts/main.hbs',
			options:
			{
				partials:
				{
					header: 'partials/header.hbs',
					footer: 'partials/footer.hbs',
				}
			}
		}
	);
	app.register(formbody);
	app.register(homeRoutes);
	app.register(userRoutes);
	
	return app;
}
