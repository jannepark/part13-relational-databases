const { DataTypes } = require('sequelize')
// add disabled column to users table
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('users', 'disabled', {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        })
        await queryInterface.createTable('sessions', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('users', 'disabled')
        await queryInterface.dropTable('sessions')
    },
}

