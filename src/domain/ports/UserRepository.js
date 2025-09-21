class UserRepository {
    async findAll() {
        throw new Error('Método findAll debe ser implementado');
    }

    async findById(id) {
        throw new Error('Método findById debe ser implementado');
    }

    async findByEmail(email) {
        throw new Error('Método findByEmail debe ser implementado');
    }

    async save(user) {
        throw new Error('Método save debe ser implementado');
    }

    async update(id, user) {
        throw new Error('Método update debe ser implementado');
    }

    async delete(id) {
        throw new Error('Método delete debe ser implementado');
    }
}

module.exports = UserRepository;