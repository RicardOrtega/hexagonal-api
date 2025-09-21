class UserService {
    async getAllUsers() {
        throw new Error('Método getAllUsers debe ser implementado');
    }

    async getUserById(id) {
        throw new Error('Método getUserById debe ser implementado');
    }

    async createUser(userData) {
        throw new Error('Método createUser debe ser implementado');
    }

    async updateUser(id, userData) {
        throw new Error('Método updateUser debe ser implementado');
    }

    async deleteUser(id) {
        throw new Error('Método deleteUser debe ser implementado');
    }

    async emailExists(email) {
        throw new Error('Método emailExists debe ser implementado');
    }
}

module.exports = UserService;