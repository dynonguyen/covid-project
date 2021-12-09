const { Sequelize } = require('sequelize');
const { STATUS_F } = require('../constants/index.constant');
const Address = require('../models/address.model');
const bcrypt = require('bcryptjs');
const District = require('../models/district.model');
const Province = require('../models/province.model');
const Ward = require('../models/ward.model');

// Hash password with bcrypt
exports.hashPassword = (password = '') => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(Number(process.env.BCRYPT_SALT) || 10, function (err, salt) {
			if (err) reject(err);

			bcrypt.hash(password, salt, function (hashErr, hash) {
				if (hashErr) reject(hashErr);
				resolve(hash);
			});
		});
	});
};

// convert statusF to string
exports.convertStatusFToStr = (statusF) => {
	for (f in STATUS_F) {
		if (STATUS_F[f] === Number(statusF)) return f;
	}
	return 'Không xác định';
};

/**
 * get full address from addressId.
 *
 * @param {number} addressId - address Id of Address Model.
 * @param {number} level - result level: 1 - only details, 2 - to ward, 3 - to district, 4 - only province, default - full
 * @return {string} result - address fully.
 */
exports.getAddressUser = async (addressId, level) => {
	try {
		let result = '';

		const address = await Address.findOne({
			raw: true,
			where: { addressId },
			attributes: [
				'details',
				[Sequelize.col('Ward.name'), 'wardName'],
				[Sequelize.col('Ward.prefix'), 'wardPrefix'],
				[Sequelize.col('Ward.District.name'), 'districtName'],
				[Sequelize.col('Ward.District.prefix'), 'districtPrefix'],
				[Sequelize.col('Ward.District.Province.name'), 'province'],
			],
			include: {
				model: Ward,
				attributes: [],
				include: {
					model: District,
					attributes: [],
					include: {
						attributes: [],
						model: Province,
					},
				},
			},
		});

		if (address) {
			const {
				details,
				wardName,
				wardPrefix,
				districtName,
				districtPrefix,
				province,
			} = address;

			switch (level) {
				case 1:
					return details;
				case 2:
					return `${details}, ${wardPrefix} ${wardName}`;
				case 3:
					return `${details}, ${wardPrefix} ${wardName}, ${districtPrefix} ${districtName}`;
				case 4:
					return province;
				default:
					return `${details}, ${wardPrefix} ${wardName}, ${districtPrefix} ${districtName}, ${province}`;
			}
		}

		return result;
	} catch (error) {
		return '';
	}
};
