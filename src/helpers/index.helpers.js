const { Sequelize } = require('sequelize');
const {
	STATUS_F,
	ACCOUNT_TYPES,
	MAX,
	JWT_SECRET,
	JWT_AUTHOR,
} = require('../constants/index.constant');
const Address = require('../models/address.model');
const bcrypt = require('bcryptjs');
const District = require('../models/district.model');
const Province = require('../models/province.model');
const Ward = require('../models/ward.model');
const User = require('../models/user.model');
const Account = require('../models/account.model');
const { v4: uuidv4 } = require('uuid');
const IsolationFacility = require('../models/isolation-facility.model');
const TreatmentHistory = require('../models/treatment-history.model');
const jwt = require('jsonwebtoken');

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
 * @param {number} level - result level: 1 - only details, 2 - to ward, 3 - to district, 4 - only province, 5 - district & province, default - full
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
				case 5:
					return `${districtPrefix} ${districtName}, ${province}`;
				default:
					return `${details}, ${wardPrefix} ${wardName}, ${districtPrefix} ${districtName}, ${province}`;
			}
		}

		return result;
	} catch (error) {
		return '';
	}
};

/**
 * parse sort from string to sort array.
 *
 * @param {string} sortStr - EX: "item1,-item2,-item3".
 * @return {[string]} sortList - Ex: ["item1", "item2 DESC", "item3 DESC"].
 */
exports.parseSortStr = (sortStr = '') => {
	if (!sortStr) return [];

	let sortList = [];

	const sortSplited = sortStr.split(',');
	sortSplited.forEach((item) => {
		const s = item.trim();
		if (s[0] === '-') {
			sortList.push(`${s.substring(1)} DESC`);
		} else {
			sortList.push(s);
		}
	});

	return sortList;
};

// omit some properties of an object
exports.omitPropObj = (obj, someKey = []) => {
	let newObj = {};
	for (let key in obj) {
		if (!someKey.includes(key)) newObj[key] = obj[key];
	}
	return { ...newObj };
};

// user info validation
exports.userValidation = async (user) => {
	if (!user) return { isValid: false, msg: 'Thông tin không hợp lệ' };

	const {
		fullname,
		peopleId,
		DOB,
		details,
		provinceId,
		districtId,
		wardId,
		isolationFacility,
	} = user;

	const fullnameRegex = /^[^`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]{1,50}$/i;
	if (!fullname || !fullnameRegex.test(fullname)) {
		return { isValid: false, msg: 'Họ tên không hợp lệ' };
	}

	const pRegex = /^\d{9,12}$/;
	if (!peopleId || !pRegex.test(peopleId)) {
		return {
			isValid: false,
			msg: 'CMND/CCCD có 9-12 chữ số (Trường hợp trẻ dưới 14 tuổi có thể dùng CMND của người bảo hộ) !',
		};
	}

	if (!DOB || new Date(DOB).getTime() >= Date.now()) {
		return { isValid: false, msg: 'Ngày sinh không hợp lệ' };
	}

	if (!details) {
		return { isValid: false, msg: 'Vui lòng điền địa chỉ cụ thể' };
	}

	if (!provinceId || isNaN(Number(provinceId))) {
		return { isValid: false, msg: 'Vui lòng chọn tỉnh/thành phố' };
	}

	if (!districtId || isNaN(Number(districtId))) {
		return { isValid: false, msg: 'Vui lòng chọn quận/huyện' };
	}

	if (!wardId || isNaN(Number(wardId))) {
		return { isValid: false, msg: 'Vui lòng chọn xã/phường' };
	}

	if (!isolationFacility || isNaN(Number(isolationFacility))) {
		return { isValid: false, msg: 'Vui lòng chọn cơ sở điều trị' };
	}

	try {
		// check if user existence
		const userExist = await User.findOne({
			raw: true,
			where: { peopleId },
		});
		if (userExist) {
			return {
				isValid: false,
				msg: 'Người bệnh đã tồn tại (kiểm tra lại CMND/CCCD)',
			};
		}

		return { isValid: true };
	} catch (error) {
		console.error('Function userValidation Error: ', error);
		return { isValid: false, msg: 'Thông tin không hợp lệ' };
	}
};

exports.addNewAddress = async (details, wardId) => {
	if (!details || isNaN(Number(wardId))) return false;
	try {
		const address = await Address.create({ wardId: Number(wardId), details });
		return address ? address.addressId : false;
	} catch (error) {
		console.error('Function addNewAddress Error: ', error);
		return false;
	}
};

exports.createUser = async (user) => {
	try {
		const { fullname, peopleId, DOB, addressId, statusF, managerId } = user;
		const account = await Account.create({
			username: peopleId,
			password: '',
			accountType: ACCOUNT_TYPES.USER,
			isLocked: false,
			failedLoginTime: 0,
		});

		if (account) {
			const newUser = await User.create({
				uuid: uuidv4(),
				fullname,
				peopleId,
				DOB: new Date(DOB),
				statusF: Number(statusF),
				managerId,
				addressId,
				accountId: account.accountId,
			});

			return newUser;
		}

		return null;
	} catch (error) {
		console.error('Function newUser Error: ', error);
		return null;
	}
};

exports.addNewTreatmentHistory = async (
	isolationFacilityId,
	userId,
	statusF
) => {
	try {
		// check capacity
		const isoFacility = await IsolationFacility.findOne({
			raw: true,
			where: { isolationFacilityId },
		});

		if (isoFacility) {
			if (isoFacility.currentQuantity >= isoFacility.capacity) {
				return {
					error: true,
					msg: `Cơ sở điều trị "${isoFacility.isolationFacilityName}" đã hết chỗ chứa`,
				};
			}

			return await TreatmentHistory.create({
				isolationFacilityId,
				userId,
				statusF: Number(statusF),
				startDate: new Date(),
				endDate: null,
			});
		}

		return {
			error: true,
			msg: `Cơ sở điều trị không tồn tại`,
		};
	} catch (error) {
		console.error('Function addNewTreatmentHistory Error: ', error);
		return {
			error: true,
			msg: `Cơ sở điều trị không tồn tại`,
		};
	}
};

exports.jwtEncode = (data, isRemember = true) => {
	const now = Date.now();
	return jwt.sign(
		{
			author: JWT_AUTHOR,
			sub: data,
			iat: now,
			exp: isRemember ? now + MAX.TOKEN_EXP : now + MAX.SESSION_EXP,
		},
		JWT_SECRET
	);
};

exports.formatCurrency = (money = 0) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(money);
};
