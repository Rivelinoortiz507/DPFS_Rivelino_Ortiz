const User = require('../models/user');
const bcrypt = require('bcrypt');

const userService = {
    getAllUsers: async () => {
        return await User.findAll();
    },

    getUserById: async (id) => {
        return await User.findByPk(id);
    },

    createUser: async (data) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            profileImage: data.profileImage
        });
    },

    findUserByEmail: async (email) => {
        return await User.findOne({ where: { email } });
    },

    validatePassword: async (inputPassword, storedPassword) => {
        return await bcrypt.compare(inputPassword, storedPassword);
    }
};

module.exports = userService;
