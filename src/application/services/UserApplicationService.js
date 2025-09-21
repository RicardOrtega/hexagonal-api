const { v4: uuidv4 } = require('uuid');
const User = require('../../domain/models/User');
const UserService = require('../../domain/ports/UserService');

class UserApplicationService extends UserService {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
    }

    async getAllUsers() {
        try {
            const users = await this.userRepository.findAll();
            return users.map(user => user.toJSON());
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    async getUserById(id) {
        if (!id) {
            throw new Error('El ID del usuario es requerido');
        }

        try {
            const user = await this.userRepository.findById(id);
            return user ? user.toJSON() : null;
        } catch (error) {
            throw new Error(`Error al buscar usuario: ${error.message}`);
        }
    }

    async createUser(userData) {
        const { name, email, age } = userData;

        if (!name || !email) {
            throw new Error('Nombre y email son campos requeridos');
        }

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Ya existe un usuario con este email');
        }

        try {
            const userId = uuidv4();
            const newUser = new User(userId, name, email, age);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.toJSON();
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        if (!id) {
            throw new Error('El ID del usuario es requerido');
        }

        try {
            const existingUser = await this.userRepository.findById(id);
            if (!existingUser) {
                throw new Error('Usuario no encontrado');
            }

            if (userData.email && userData.email !== existingUser.email) {
                const userWithEmail = await this.userRepository.findByEmail(userData.email);
                if (userWithEmail) {
                    throw new Error('Ya existe un usuario con este email');
                }
            }

            existingUser.update(userData);
            const updatedUser = await this.userRepository.update(id, existingUser);
            return updatedUser ? updatedUser.toJSON() : null;
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    async deleteUser(id) {
        if (!id) {
            throw new Error('El ID del usuario es requerido');
        }

        try {
            const existingUser = await this.userRepository.findById(id);
            if (!existingUser) {
                throw new Error('Usuario no encontrado');
            }

            return await this.userRepository.delete(id);
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

    async emailExists(email) {
        if (!email) {
            return false;
        }

        try {
            const user = await this.userRepository.findByEmail(email);
            return !!user;
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    }

    async getUserStats() {
        try {
            const users = await this.userRepository.findAll();
            const totalUsers = users.length;
            
            const avgAge = users.length > 0 
                ? users.filter(u => u.age).reduce((sum, u) => sum + u.age, 0) / users.filter(u => u.age).length
                : 0;

            return {
                totalUsers,
                averageAge: Math.round(avgAge * 100) / 100,
                usersWithAge: users.filter(u => u.age).length
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

module.exports = UserApplicationService;