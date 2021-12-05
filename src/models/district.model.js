const { DataTypes, db } = require('../configs/db.config');
const Province = require('./province.model');

const District = db.define(
	'District',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		prefix: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
	},
	{ tableName: 'District', timestamps: false }
);

// Foreign Key
Province.hasMany(District, {
	sourceKey: 'id',
	foreignKey: {
		name: 'provinceId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
District.belongsTo(Province, {
	foreignKey: 'provinceId',
});

module.exports = District;
