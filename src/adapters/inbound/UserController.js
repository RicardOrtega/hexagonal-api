class UserController {
    constructor(userService) {
        this.userService = userService;
        
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.getUserStats = this.getUserStats.bind(this);
        this.checkEmail = this.checkEmail.bind(this);
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({
                success: true,
                message: 'Usuarios obtenidos correctamente',
                data: users,
                count: users.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios',
                error: error.message
            });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Usuario encontrado',
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al buscar usuario',
                error: error.message
            });
        }
    }

    async createUser(req, res) {
        try {
            const { name, email, age } = req.body;
            
            if (!name || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre y email son campos requeridos'
                });
            }

            const userData = { name, email };
            if (age !== undefined) userData.age = age;

            const newUser = await this.userService.createUser(userData);

            res.status(201).json({
                success: true,
                message: 'Usuario creado correctamente',
                data: newUser
            });
        } catch (error) {
            const statusCode = error.message.includes('Ya existe') ? 409 : 400;
            res.status(statusCode).json({
                success: false,
                message: 'Error al crear usuario',
                error: error.message
            });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, age } = req.body;

            const userData = {};
            if (name) userData.name = name;
            if (email) userData.email = email;
            if (age !== undefined) userData.age = age;

            const updatedUser = await this.userService.updateUser(id, userData);

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Usuario actualizado correctamente',
                data: updatedUser
            });
        } catch (error) {
            const statusCode = error.message.includes('Ya existe') ? 409 : 400;
            res.status(statusCode).json({
                success: false,
                message: 'Error al actualizar usuario',
                error: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deleted = await this.userService.deleteUser(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Usuario eliminado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al eliminar usuario',
                error: error.message
            });
        }
    }

    async getUserStats(req, res) {
        try {
            const stats = await this.userService.getUserStats();
            res.status(200).json({
                success: true,
                message: 'Estadísticas obtenidas correctamente',
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas',
                error: error.message
            });
        }
    }

    async checkEmail(req, res) {
        try {
            const { email } = req.params;
            const exists = await this.userService.emailExists(email);
            
            res.status(200).json({
                success: true,
                message: 'Verificación completada',
                data: {
                    email,
                    exists
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al verificar email',
                error: error.message
            });
        }
    }
}

module.exports = UserController;