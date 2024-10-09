module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING, 
      allowNull: true 
    },
    age: {
      type: DataTypes.INTEGER, // Añade el campo 'age' aquí
      allowNull: true, // Cambia esto si quieres que sea requerido
    },
    profileImageUrl: {
      type: DataTypes.STRING, 
      allowNull: true // Cambiar a false si es obligatorio
    }
  }, {
    timestamps: false,
    tableName: 'users'
  });

  User.associate = (models) => {
    User.hasMany(models.Product, { foreignKey: 'userId' });
  };

  return User;
};
