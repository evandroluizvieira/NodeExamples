export default async function (app, opts) {
	const renderHome = async (request, reply) => {
		try {
			const currentYear = new Date().getFullYear();
			return reply.view(
				'pages/index', {
					title: 'Node Examples',
					year: currentYear
				}
			);
		} catch (error) {
			console.error('Rendering error:', error);
			throw error;
		}
	};
	
	app.get('/', renderHome);
	app.get('/home', renderHome);
	app.get('/index', renderHome);
}
