const {
	getAddressUser,
	parseSortStr,
	omitPropObj,
} = require('../../helpers/index.helpers');
const { MAX } = require('../../constants/index.constant');
const IsolationFacility = require('../../models/isolation-facility.model');
const { Op } = require('../../configs/db.config');
const { Sequelize } = require('sequelize');

exports.getILFList = async (req, res) => {
	let { page = 1, sort = '', search = '' } = req.query;
	const sortList = parseSortStr(sort);
	const order = sortList.map((i) => i.split(' '));

	page = Number(page);
	if (isNaN(page) || page < 1) page = 1;

	const where = search
		? {
				[Op.or]: [
					{
						isolationFacilityName: Sequelize.where(
							Sequelize.fn('LOWER', Sequelize.col('isolationFacilityName')),
							'LIKE',
							`%${search.toLowerCase()}%`
						),
					},
				],
		  }
		: {};

	try {
		const ILFs = await IsolationFacility.findAndCountAll({
			raw: true,
			order,
			attributes: [
				'isolationFacilityId',
				'isolationFacilityName',
				'capacity',
				'currentQuantity',
				'addressId',
			],
			where,
			limit: MAX.PAGE_SIZE,
			offset: (page - 1) * MAX.PAGE_SIZE,
		});

		for (let ilf of ILFs.rows) {
			const address = await getAddressUser(ilf.addressId);
			ilf.address = address;
		}

		const ilfList = ILFs.rows.map((ilf) => omitPropObj(ilf, ['addressId']));

		return res.render('./admin/isolation-facilities/view-list', {
			ilfList,
			total: ILFs.count,
			currentPage: page,
			pageSize: MAX.PAGE_SIZE,
			sortList: sortList.join(','),
			search,
		});
	} catch (error) {
		console.error('Function getILFList Error: ', error);
		return res.render('404');
	}
};

exports.putUpdateIF = async (req, res) => {
	let { ifName, ifCapacity, ifId } = req.body;
	ifName = ifName.length <= 100 ? ifName : ifName.slice(0, 100);
	ifCapacity = Number(ifCapacity);
	ifId = Number(ifId);

	try {
		if (isNaN(ifCapacity) || !ifName || isNaN(ifId)) throw new Error();

		await IsolationFacility.update(
			{
				isolationFacilityName: ifName,
				capacity: ifCapacity,
			},
			{
				where: {
					isolationFacilityId: Number(ifId),
				},
			}
		);

		return res.status(200).json({});
	} catch (error) {
		console.error('Function putUpdateIF Error: ', error);
		return res.status(400).json({});
	}
};
