const Account = require('../../../src/models/account.model');
const AdminAccount = require('../../../src/models/admin-account.model');
const AccountHistory = require('../../../src/models/account-history.model');
const Address = require('../../../src/models/address.model');
const ConsumptionHistory = require('../../../src/models/consumption-history.model');
const District = require('../../../src/models/district.model');
const IsolationFacility = require('../../../src/models/isolation-facility.model');
const PaymentHistory = require('../../../src/models/payment-history.model');
const Product = require('../../../src/models/product.model');
const ProductImage = require('../../../src/models/product-image.model');
const ProductInPackage = require('../../../src/models/product-in-package.model');
const ProductPackage = require('../../../src/models/product-package.model');
const Province = require('../../../src/models/province.model');
const RelatedUser = require('../../../src/models/related-user.model');
const TreatmentHistory = require('../../../src/models/treatment-history.model');
const User = require('../../../src/models/user.model');
const Ward = require('../../../src/models/ward.model');

const faker = require('faker');
const QUANTITY = 200;

// Account
const forAccount = async () => {
	faker.locale = 'en';
	// password: 12345678 - salt = 10

	const promises = [];
	// 5 manager
	for (let i = 0; i < 5; ++i) {
		promises.push(
			Account.create({
				username: `manager0${i + 1}`,
				password:
					'$2a$10$so40xTlmcQVV5Dc0bTvGQuVvSCJfZv205vIwuSQI2OUajkp3IOpua',
				accountType: 1,
				isLocked: false,
				failedLoginTime: 0,
			})
		);
	}

	for (let i = 5; i < QUANTITY; ++i) {
		promises.push(
			Account.create({
				username: faker.internet.userName(),
				password:
					'$2a$10$so40xTlmcQVV5Dc0bTvGQuVvSCJfZv205vIwuSQI2OUajkp3IOpua',
				accountType: 0,
				isLocked: false,
				failedLoginTime: 0,
			})
		);
	}
	return await Promise.all(promises);
};

// Account History
const forAccountHistory = async () => {
	faker.locale = 'en';
	const promises = [];
	for (let i = 0; i < QUANTITY; ++i) {
		promises.push(
			AccountHistory.create({
				activity: faker.lorem.words(10),
				createdDate: faker.date.between('2018-01-01', '2022-01-01'),
				accountId: (i % 5) + 1,
			})
		);
	}
	return await Promise.all(promises);
};

// Address
const forAddress = async () => {
	faker.locale = 'vi';

	const promises = [];
	for (let i = 1; i < 11283; i += Math.round(11283 / QUANTITY)) {
		promises.push(
			Address.create({
				wardId: i,
				details: faker.address.streetAddress(true),
			})
		);
	}

	return await Promise.all(promises);
};

// User
const forUser = async () => {
	faker.locale = 'vi';
	const time = Date.now();
	let statusF = 0;

	const promises = [];
	for (let i = 6; i < 20; i += 1) {
		promises.push(
			User.create({
				uuid: faker.datatype.uuid(),
				fullname: faker.name.findName(),
				peopleId: `${time + i}`.slice(1, 13),
				DOB: faker.date.between('1950-01-01', '2022-01-01'),
				statusF: -1,
				accountId: i,
				managerId: (i % 5) + 1,
				addressId: i,
			})
		);
	}

	for (let i = 20; i < QUANTITY - 1; i++) {
		promises.push(
			User.create({
				uuid: faker.datatype.uuid(),
				fullname: faker.name.findName(),
				peopleId: `${time + i}`.slice(1, 13),
				DOB: faker.date.between('1950-01-01', '2022-01-01'),
				statusF: statusF++ % 5,
				accountId: i,
				managerId: (i % 5) + 1,
				addressId: i,
			})
		);
	}
	return await Promise.all(promises);
};

// Isolation Facility
const forIsoFac = async () => {
	faker.locale = 'vi';

	const promises = [];
	for (let i = 1; i < 20; i++) {
		const cap = Math.round(faker.datatype.number(5000));
		const curcap = Math.round(faker.datatype.number(4000));
		promises.push(
			IsolationFacility.create({
				isolationFacilityName: `${
					i % 2 ? 'Bệnh viện' : 'Khu cách ly'
				} ${faker.company.companyName()}`,
				capacity: cap,
				currentQuantity: curcap <= cap ? curcap : 1,
				addressId: i,
			})
		);
	}
	return await Promise.all(promises);
};

// Related User
const forRelatedUser = async () => {
	const promises = [];
	for (let i = 20; i < QUANTITY - 21; i++) {
		promises.push(
			RelatedUser.create({
				originUserId: i,
				relatedUserId: i + 1,
			})
		);
	}
	return await Promise.all(promises);
};

// Product
const forProduct = async () => {
	faker.locale = 'vi';

	const promises = [];
	for (let i = 1; i < QUANTITY * 3; i++) {
		promises.push(
			Product.create({
				productName: faker.commerce.product(),
				price: parseInt(faker.datatype.number(1_000_000)),
				unit: i % 3 === 0 ? 'KG' : i % 3 === 1 ? 'Túi' : 'Cái',
			})
		);
	}
	return await Promise.all(promises);
};

// Product Image
const forProductImg = async () => {
	faker.locale = 'vi';

	const promises = [];
	for (let i = 1; i < QUANTITY * 3; i++) {
		promises.push(
			ProductImage.create({
				productId: i,
				src: faker.image.avatar(),
				isThumbnail: true,
			})
		);

		promises.push(
			ProductImage.create({
				productId: i,
				src: faker.image.food(256, 256),
				isThumbnail: false,
			})
		);

		promises.push(
			ProductImage.create({
				productId: i,
				src: faker.image.food(256, 256),
				isThumbnail: false,
			})
		);
	}
	return await Promise.all(promises);
};

// Product Package
const forProductPackage = async () => {
	faker.locale = 'vi';

	const promises = [];
	for (let i = 1; i < QUANTITY * 3; i++) {
		const inD = ~~faker.datatype.number(20) + 1;
		let inW = ~~faker.datatype.number(200) + 1;
		if (inW <= inD) inW = inD * 7;
		let inM = ~~faker.datatype.number(800) + 1;
		if (inM < inW) inM = inW * 4;

		promises.push(
			ProductPackage.create({
				productPackageName: faker.commerce.productName(),
				limitedProducts: ~~faker.datatype.number(1000) + 1,
				limitedInDay: inD,
				limitedInWeek: inW,
				limitedInMonth: inM,
			})
		);
	}
	return await Promise.all(promises);
};

// Product Package
const forProductInPackage = async () => {
	faker.locale = 'vi';

	const promises = [];
	for (let i = 1; i < QUANTITY * 3 - 3; i++) {
		const maxQuantity = ~~faker.datatype.number(100);
		const quantity = ~~faker.datatype.number(20);

		promises.push(
			ProductInPackage.create({
				productId: i,
				productPackageId: i,
				maxQuantity: maxQuantity,
				quantity: quantity > maxQuantity ? maxQuantity : quantity,
			})
		);

		promises.push(
			ProductInPackage.create({
				productId: i + 1,
				productPackageId: i,
				maxQuantity: maxQuantity + 2,
				quantity:
					quantity + 2 > maxQuantity + 2 ? maxQuantity + 2 : quantity + 2,
			})
		);

		promises.push(
			ProductInPackage.create({
				productId: i + 2,
				productPackageId: i,
				maxQuantity: maxQuantity + 3,
				quantity:
					quantity + 3 > maxQuantity + 3 ? maxQuantity + 3 : quantity + 3,
			})
		);
	}
	return await Promise.all(promises);
};

// Treatment History
const forTreatmentHistory = async () => {
	faker.locale = 'vi';

	const promises = [];
	for (let i = 6; i < 20; i++) {
		promises.push(
			TreatmentHistory.create({
				startDate: faker.date.between('2018-01-01', '2019-01-01'),
				endDate: faker.date.between('2019-02-02', '2022-01-01'),
				statusF: i % 5,
				userId: i,
				isolationFacilityId: (i % 19) + 1,
			})
		);
	}

	for (let i = 20; i < QUANTITY - 21; i++) {
		promises.push(
			TreatmentHistory.create({
				startDate: faker.date.between('2018-01-01', '2019-01-01'),
				endDate: null,
				statusF: i % 6,
				userId: i,
				isolationFacilityId: (i % 19) + 1,
			})
		);
	}
	return await Promise.all(promises);
};

// Consumption
const forConsumptionHistory = async () => {
	const promises = [];
	for (let i = 1; i < QUANTITY * 3; i++) {
		promises.push(
			ConsumptionHistory.create({
				buyDate: faker.date.between('2019-01-01', '2022-01-01'),
				totalPrice: faker.datatype.number(10_000_000),
				userId: (i % ~~(QUANTITY / 2 - 1)) + 1,
				productPackageId: i,
			})
		);
	}
	return await Promise.all(promises);
};

// Payment
const forPaymentHistory = async () => {
	const promises = [];
	for (let i = 6; i < QUANTITY * 3; i++) {
		const type = i % 2;

		promises.push(
			PaymentHistory.create({
				paymentDate: faker.date.between('2019-01-01', '2022-01-01'),
				currentBalance: ~~faker.datatype.number(100_000_000),
				paymentType: type,
				paymentCode: faker.datatype.uuid(),
				totalMoney: ~~faker.datatype.number(10_000_000),
				userId: (i % ~~(QUANTITY - 7)) + 1,
				consumptionHistoryId: type ? null : i,
			})
		);
	}
	return await Promise.all(promises);
};

module.exports = async () => {
	// Đặt file này ở ngoài src
	// Import vào file index.js trong src
	// chạy hàm này trong then của db.sync
	// Comment lại hêt trong lần chạy đầu tiên để khởi tạo database
	// Insert dữ liệu province, district, wards trong db trước
	// Mở comment và chạy lại lần 2

	console.time('Time');
	// await forAccount();
	// await forAccountHistory();
	// await forAddress();
	// await forUser();
	// await forRelatedUser();
	// await forIsoFac();
	// await forProduct();
	// await forProductImg();
	// await forProductPackage();
	// await forProductInPackage();
	// await forTreatmentHistory();
	// await forConsumptionHistory();
	// await forPaymentHistory();
	console.timeEnd('Time');
};
