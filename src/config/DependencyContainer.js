const User = require('../domain/models/User');
const UserApplicationService = require('../application/services/UserApplicationService');
const InMemoryUserRepository = require('../adapters/outbound/InMemoryUserRepository');
const FileUserRepository = require('../adapters/outbound/FileUserRepository');
const UserController = require('../adapters/inbound/UserController');

class DependencyContainer {
    constructor(useFileRepository = false) {
        this.useFileRepository = useFileRepository;
        this._initializeDependencies();
    }

    _initializeDependencies() {
        if (this.useFileRepository) {
            this.userRepository = new FileUserRepository('./data/users.json');
            console.log('Usando FileUserRepository');
        } else {
            this.userRepository = new InMemoryUserRepository();
            console.log('Usando InMemoryUserRepository');
        }

        this.userService = new UserApplicationService(this.userRepository);
        this.userController = new UserController(this.userService);

        console.log('Dependencias inicializadas');
    }

    getUserController() {
        return this.userController;
    }

    getUserService() {
        return this.userService;
    }

    getUserRepository() {
        return this.userRepository;
    }

    switchRepository(useFile) {
        this.useFileRepository = useFile;
        this._initializeDependencies();
    }

    async initializeTestData() {
        try {
            const existingUsers = await this.userRepository.findAll();
            if (existingUsers.length > 0) {
                console.log('Datos ya existen');
                return;
            }

            const testUsers = [
                new User('1', 'Juan Pérez', 'juan.perez@email.com', 25),
                new User('2', 'María García', 'maria.garcia@email.com', 30),
                new User('3', 'Carlos López', 'carlos.lopez@email.com', 28)
            ];

            for (const user of testUsers) {
                await this.userRepository.save(user);
            }

            console.log('Datos de prueba inicializados');
        } catch (error) {
            console.error('Error al inicializar datos:', error.message);
        }
    }
}

module.exports = DependencyContainer;