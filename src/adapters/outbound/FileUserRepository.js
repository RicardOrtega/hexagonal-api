const fs = require('fs').promises;
const path = require('path');
const UserRepository = require('../../domain/ports/UserRepository');
const User = require('../../domain/models/User');

/**
 * FileUserRepository - Adaptador Outbound
 * Implementación con persistencia en archivo JSON del puerto UserRepository
 */
class FileUserRepository extends UserRepository {
    constructor(filePath = './data/users.json') {
        super();
        this.filePath = filePath;
        this.ensureDataDirectory();
    }

    /**
     * Asegurar que el directorio de datos existe
     */
    async ensureDataDirectory() {
        const dir = path.dirname(this.filePath);
        try {
            await fs.access(dir);
        } catch (error) {
            await fs.mkdir(dir, { recursive: true });
        }
    }

    /**
     * Leer usuarios desde archivo
     * @returns {Promise<User[]>}
     */
    async readUsersFromFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            const usersData = JSON.parse(data);
            return usersData.map(userData => 
                new User(userData.id, userData.name, userData.email, userData.age, new Date(userData.createdAt))
            );
        } catch (error) {
            // Si el archivo no existe, retornar array vacío
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    /**
     * Escribir usuarios al archivo
     * @param {User[]} users 
     */
    async writeUsersToFile(users) {
        await this.ensureDataDirectory();
        const data = JSON.stringify(users.map(user => user.toJSON()), null, 2);
        await fs.writeFile(this.filePath, data, 'utf8');
    }

    /**
     * Buscar todos los usuarios
     * @returns {Promise<User[]>}
     */
    async findAll() {
        return await this.readUsersFromFile();
    }

    /**
     * Buscar usuario por ID
     * @param {string} id 
     * @returns {Promise<User|null>}
     */
    async findById(id) {
        const users = await this.readUsersFromFile();
        const user = users.find(u => u.id === id);
        return user || null;
    }

    /**
     * Buscar usuario por email
     * @param {string} email 
     * @returns {Promise<User|null>}
     */
    async findByEmail(email) {
        const users = await this.readUsersFromFile();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        return user || null;
    }

    /**
     * Guardar un nuevo usuario
     * @param {User} user 
     * @returns {Promise<User>}
     */
    async save(user) {
        const users = await this.readUsersFromFile();
        users.push(user);
        await this.writeUsersToFile(users);
        return user;
    }

    /**
     * Actualizar un usuario existente
     * @param {string} id 
     * @param {User} user 
     * @returns {Promise<User|null>}
     */
    async update(id, user) {
        const users = await this.readUsersFromFile();
        const index = users.findIndex(u => u.id === id);
        
        if (index !== -1) {
            users[index] = user;
            await this.writeUsersToFile(users);
            return user;
        }
        
        return null;
    }

    /**
     * Eliminar un usuario
     * @param {string} id 
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const users = await this.readUsersFromFile();
        const initialLength = users.length;
        const filteredUsers = users.filter(u => u.id !== id);
        
        if (filteredUsers.length !== initialLength) {
            await this.writeUsersToFile(filteredUsers);
            return true;
        }
        
        return false;
    }

    /**
     * Limpiar todos los usuarios (útil para testing)
     * @returns {Promise<void>}
     */
    async clear() {
        await this.writeUsersToFile([]);
    }
}

module.exports = FileUserRepository;