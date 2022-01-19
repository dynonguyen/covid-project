const jwt = require('jsonwebtoken');
const { db } = require('../../configs/db.config');
const {
	PAYMENT_SYS_AUTH_PRIVATE_KEY,
	PAYMENT_SYS_URL,
	PAYMENT_TRACKING_QUERY_KEY,
	PAYMENT_TYPES,
} = require('../../constants/index.constant');
const ConsumptionHistory = require('../../models/consumption-history.model');
const ConsumptionPIP = require('../../models/consumption-pip.model');
const PaymentHistory = require('../../models/payment-history.model');
const User = require('../../models/user.model');
const {
	getUserBalance,
	postPayment: axiosPostPayment,
} = require('../../payment-api');
const { v4: uuidv4 } = require('uuid');

function recalculateCarts(packages = []) {
	let totalMoney = 0;
	packages.forEach((pack) => {
		pack.products.forEach((prod) => {
			totalMoney += prod.productPrice * prod.quantity;
		});
	});

	return totalMoney;
}

async function paymentProcess(userId, paymentTotal, packages = []) {
	const tx = await db.transaction();
	try {
		const promises = [];
		// create all consumption histories and ConsumptionPIP
		packages.forEach((pack) => {
			promises.push(
				ConsumptionHistory.create(
					{
						totalPrice: Number(pack.totalPrice),
						buyDate: new Date(),
						userId,
						productPackageId: pack.productPackageId,
					},
					{ transaction: tx }
				).then((consumption) => {
					const { consumptionHistoryId } = consumption;
					pack.products?.forEach((prod) => {
						promises.push(
							ConsumptionPIP.create(
								{
									quantity: Number(prod.quantity),
									consumptionHistoryId,
									productInPackageId: Number(prod.productInPackageId),
								},
								{ transaction: tx }
							)
						);
					});
				})
			);
		});

		// call API to payment in payment system
		promises.push(
			axiosPostPayment({
				userId,
				totalMoney: paymentTotal,
			}).then((data) => {
				const { currentBalance } = data;
				promises.push(
					PaymentHistory.create({
						paymentDate: new Date(),
						currentBalance,
						paymentType: PAYMENT_TYPES.CONSUME,
						paymentCode: uuidv4(),
						totalMoney: paymentTotal,
						userId,
						consumptionId: null,
					})
				);
			})
		);

		await Promise.all(promises);
		await tx.commit();
		return true;
	} catch (error) {
		await tx.rollback();
		throw error;
	}
}

exports.getPutMoney = (req, res) => {
	const { userId } = req.user;

	let callbackUrl = '';
	if (process.env.NODE_ENV?.trim() === 'development') {
		callbackUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/user/info/balance`;
	} else {
		callbackUrl = `${req.protocol}://${req.hostname}/user/info/balance`;
	}

	const token = jwt.sign(
		{
			issuer: 'Covid Project',
			iat: Date.now(),
			sub: {
				userId,
				callbackUrl,
			},
		},
		PAYMENT_SYS_AUTH_PRIVATE_KEY,
		{ expiresIn: 30 * 60 }
	);

	return res.redirect(
		`${PAYMENT_SYS_URL}/auth/login?${PAYMENT_TRACKING_QUERY_KEY}=${token}`
	);
};

exports.postPayment = async (req, res) => {
	const { carts } = req.body;
	let { paymentTotal, packages } = carts;
	paymentTotal = Number(paymentTotal);

	if (isNaN(paymentTotal) || !packages || packages.length === 0) {
		return res.status(400).json({});
	}

	const { accountId } = req.user;

	try {
		// recalculate payment total
		const recalculatedTotalMoney = recalculateCarts(packages);
		if (recalculatedTotalMoney !== paymentTotal) {
			// return res.status(400).json({});
		}

		// get user id
		const { userId } = await User.findOne({ raw: true, where: { accountId } });

		// check user's balance
		const userBalance = await getUserBalance(userId);

		// Not enough money -> show debt modal
		if (userBalance < paymentTotal) {
			return res.status(406).json({ balance: userBalance, paymentTotal });
		}

		// payment processing ...
		await paymentProcess(userId, paymentTotal, packages);
		return res.status(200).json({ msg: 'Successfully' });
	} catch (error) {
		console.error('Function postPayment Error: ', error);
		return res.status(500).json({ msg: 'Thanh toán thất bại' });
	}
};
