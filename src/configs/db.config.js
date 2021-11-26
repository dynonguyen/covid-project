const Sequelize = require('sequelize');

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres',
});

const { Op } = Sequelize;

module.exports = {
	db,
	Op,
};
