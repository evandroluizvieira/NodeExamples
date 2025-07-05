export default async function (app, opts) {
	app.get(
		'/',
		async (request, reply) => {
			try {
				return reply.view(
					'index',
					{
						title: 'Página Inicial',
						message: 'Bem-vindo ao NodeExamples com Fastify!'
					}
				);
			} catch (error) {
				console.error('Erro na renderização:', error);
				throw error;
			}
		}
	);
}
