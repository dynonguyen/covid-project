const { DataTypes, db } = require('../configs/db.config');
const { STATUS_F } = require('../constants/index.constant');
const IsolationFacility = require('./isolationFacility.model');
const User = require('./user.model');

const TreatmentHistory = db.define(
	'TreatmentHistory',
	{
		treatmentHistoryId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		statusF: {
			type: DataTypes.SMALLINT,
			allowNull: false,
			defaultValue: STATUS_F.F0,
		},
	},
	{ tableName: 'TreatmentHistory', timestamps: false, initialAutoIncrement: 1 }
);

// Foreign key
User.hasMany(TreatmentHistory, {
	sourceKey: 'userId',
	foreignKey: {
		name: 'userId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
TreatmentHistory.belongsTo(User, { foreignKey: 'userId' });

IsolationFacility.hasMany(TreatmentHistory, {
	sourceKey: 'isolationFacilityId',
	foreignKey: {
		name: 'isolationFacilityId',
		allowNull: false,
	},
	onUpdate: 'CASCADE',
	onDelete: 'RESTRICT',
});
TreatmentHistory.belongsTo(IsolationFacility, {
	foreignKey: 'isolationFacilityId',
});

module.exports = TreatmentHistory;
