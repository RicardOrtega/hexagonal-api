class User {
    constructor(id, name, email, age, createdAt = new Date()) {
        if (!name || typeof name !== 'string') {
            throw new Error('El nombre es obligatorio y debe ser una cadena');
        }
        
        if (!email || !this.isValidEmail(email)) {
            throw new Error('El email es obligatorio y debe tener un formato válido');
        }
        
        if (age && (typeof age !== 'number' || age < 0 || age > 150)) {
            throw new Error('La edad debe ser un número entre 0 y 150');
        }

        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.createdAt = createdAt;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    update(updates) {
        if (updates.name && typeof updates.name === 'string') {
            this.name = updates.name;
        }
        
        if (updates.email && this.isValidEmail(updates.email)) {
            this.email = updates.email;
        }
        
        if (updates.age && typeof updates.age === 'number' && updates.age >= 0 && updates.age <= 150) {
            this.age = updates.age;
        }
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            age: this.age,
            createdAt: this.createdAt
        };
    }
}

module.exports = User;