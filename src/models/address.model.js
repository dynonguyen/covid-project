const { DataTypes, db } = require('../configs/db.config');
const Ward = require('./ward.model');

const Address = db.define(
	'Address',
	{
		addressId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		details: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{ tableName: 'Address', timestamps: false, initialAutoIncrement: 1000 }
);

// Foreign key
Ward.hasMany(Address, {
	sourceKey: 'id',
	foreignKey: {
		name: 'wardId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
Address.belongsTo(Ward, {
	foreignKey: 'wardId',
});

module.exports = Address;
