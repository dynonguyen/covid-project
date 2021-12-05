const { DataTypes, db } = require('../configs/db.config');
const District = require('./district.model');

const Ward = db.define(
	'Ward',
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
	{ tableName: 'Ward', timestamps: false }
);

// Foreign key
District.hasMany(Ward, {
	sourceKey: 'id',
	foreignKey: 'districtId',
});
Ward.belongsTo(District, {
	foreignKey: 'districtId',
});

module.exports = Ward;
