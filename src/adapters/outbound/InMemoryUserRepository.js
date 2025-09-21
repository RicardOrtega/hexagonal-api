const UserRepository = require('../../domain/ports/UserRepository');

class InMemoryUserRepository extends UserRepository {
    constructor() {
        super();
        this.users = new Map();
    }

    async findAll() {
        return Array.from(this.users.values());
    }

    async findById(id) {
        const user = this.users.get(id);
        return user || null;
    }

    async findByEmail(email) {
        const users = Array.from(this.users.values());
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        return user || null;
    }

    async save(user) {
        this.users.set(user.id, user);
        return user;
    }

    async update(id, user) {
        if (this.users.has(id)) {
            this.users.set(id, user);
            return user;
        }
        return null;
    }

    async delete(id) {
        return this.users.delete(id);
    }

    async clear() {
        this.users.clear();
    }

    async count() {
        return this.users.size;
    }
}

module.exports = InMemoryUserRepository;