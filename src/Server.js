const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const DependencyContainer = require('./config/DependencyContainer');
const createUserRoutes = require('./adapters/inbound/UserRoutes');

class Server {
    constructor(port = 3000, useFileRepository = false) {
        this.port = port;
        this.app = express();
        
        this.dependencyContainer = new DependencyContainer(useFileRepository);
        
        this._setupMiddlewares();
        this._setupRoutes();
        this._setupErrorHandling();
    }

    _setupMiddlewares() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(morgan('combined'));
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        
        console.log('Middlewares configurados');
    }

    _setupRoutes() {
        this.app.get('/health', (req, res) => {
            res.json({
                success: true,
                message: 'API funcionando',
                timestamp: new Date().toISOString()
            });
        });

        this.app.get('/api', (req, res) => {
            res.json({
                success: true,
                message: 'Hexagonal Architecture API',
                version: '1.0.0',
                endpoints: {
                    getUsers: 'GET /api/users',
                    createUser: 'POST /api/users',
                    getUser: 'GET /api/users/:id',
                    updateUser: 'PUT /api/users/:id',
                    deleteUser: 'DELETE /api/users/:id'
                }
            });
        });

        const userController = this.dependencyContainer.getUserController();
        const userRoutes = createUserRoutes(userController);
        this.app.use('/api', userRoutes);

        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Endpoint no encontrado'
            });
        });

        console.log('Rutas configuradas');
    }

    _setupErrorHandling() {
        this.app.use((error, req, res, next) => {
            console.error('Error:', error.message);

            if (error instanceof SyntaxError && error.status === 400) {
                return res.status(400).json({
                    success: false,
                    message: 'JSON inválido'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        });
    }

    async initializeTestData() {
        await this.dependencyContainer.initializeTestData();
    }

    async start() {
        try {
            await this.initializeTestData();

            this.server = this.app.listen(this.port, () => {
                console.log('\n========================================');
                console.log('  HEXAGONAL ARCHITECTURE API');
                console.log('========================================');
                console.log(`  Servidor en puerto ${this.port}`);
                console.log(`  URL: http://localhost:${this.port}`);
                console.log('========================================\n');
            });

            process.on('SIGTERM', () => this.stop());
            process.on('SIGINT', () => this.stop());

        } catch (error) {
            console.error('Error al iniciar:', error.message);
            process.exit(1);
        }
    }

    stop() {
        if (this.server) {
            console.log('\nDeteniendo servidor...');
            this.server.close(() => {
                console.log('Servidor detenido');
                process.exit(0);
            });
        }
    }
}

module.exports = Server;