const { DataTypes, db } = require('../configs/db.config');

const Province = db.define(
	'Province',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING(5),
			allowNull: false,
		},
	},
	{ tableName: 'Province', timestamps: false }
);

module.exports = Province;
