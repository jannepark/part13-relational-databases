const { DataTypes } = require('sequelize');
// add year to blog, which is an integer at least equal to 1991 but not greater than the current year. 

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('blogs', 'year', {
            type: DataTypes.INTEGER,
            allowNull: false,
        });
    },
    down: async ({ context: queryInterface }) => {

        await queryInterface.removeColumn('blogs', 'year');
    }
}
