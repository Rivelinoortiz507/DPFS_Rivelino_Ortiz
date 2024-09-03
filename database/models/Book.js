module.exports = function(sequelize, dataTypes){
    let alias = 'Book' // El nombre en el cual sequelize identificara al modelo cuando lo necesitemos invocar.

    let cols = {
        id:{
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },

        title:{
            type: dataTypes.STRING,
        },
        descrption:{
            type: dataTypes.STRING,
        },
        category:{
            type: dataTypes.INTEGER,
        }
    }

    let config = {
        tableName: 'Books',
        timestamps: true, // Si en la tabla estan los campos create_at y update_at o su equivalente a CamelCase createAt
        underscored: true, // Si los nombres de los campos create_at estan escritos con guion bajo 
    }




 const Book = sequelize.define(alias, cols, config)
 return Book;

}