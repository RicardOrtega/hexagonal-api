const Server = require('./src/Server');

const PORT = process.env.PORT || 3000;
const USE_FILE_REPOSITORY = process.env.USE_FILE_REPOSITORY === 'true' || false;

async function main() {
    try {
        console.log('Iniciando servidor...');
        
        const server = new Server(PORT, USE_FILE_REPOSITORY);
        await server.start();
        
    } catch (error) {
        console.error('Error al iniciar:', error.message);
        process.exit(1);
    }
}

main();