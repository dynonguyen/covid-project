const Sequelize = require('sequelize');
const { db } = require('../configs/db.config');

const User = db.define(
	'users',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
		},
		username: {
			type: Sequelize.STRING,
		},
		age: {
			type: Sequelize.INTEGER,
		},
	},
	{ timestamps: false, tableName: 'users' }
);

module.exports = User;
