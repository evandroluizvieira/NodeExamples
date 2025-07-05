import path				from 'path';
import url				from 'url';
import handlebars		from 'handlebars';
import Fastify			from 'fastify';
import view				from '@fastify/view';
import staticPlugin		from '@fastify/static';
import homeRoutes		from './routes/home.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();

app.register(
	staticPlugin,
	{
		root: path.join(__dirname, '..', 'public'),
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

app.register(homeRoutes);

export default app;
