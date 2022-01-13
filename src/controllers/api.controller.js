const { getPackageList } = require('../helpers/index.helpers');
const District = require('../models/district.model');
const IsolationFacility = require('../models/isolation-facility.model');
const Province = require('../models/province.model');
const User = require('../models/user.model');
const Ward = require('../models/ward.model');

exports.getAllProvince = async (req, res) => {
	try {
		const provinces = await Province.findAll({
			raw: true,
			attributes: ['id', 'name'],
		});
		return res.status(200).json(provinces);
	} catch (error) {
		console.error('Function getAllProvince Error: ', error);
		return res.json([]);
	}
};

exports.getDistrictOfProvince = async (req, res) => {
	let { provinceId } = req.params;
	try {
		const districts = await District.findAll({
			raw: true,
			where: {
				provinceId: Number(provinceId),
			},
		});
		return res.status(200).json(districts);
	} catch (error) {
		console.error('Function getDistrictOfProvince Error: ', error);
		return res.json([]);
	}
};

exports.getWardOfDistrict = async (req, res) => {
	const { districtId } = req.params;

	try {
		const wards = await Ward.findAll({
			raw: true,
			where: { districtId: Number(districtId) },
		});

		return res.status(200).json(wards);
	} catch (error) {
		console.error('Function getWardOfDistrict Error: ', error);
		return res.json([]);
	}
};

exports.getUserWithStatus = async (req, res) => {
	const { statusF } = req.params;
	try {
		const users = await User.findAll({
			raw: true,
			where: { statusF: Number(statusF) },
			attributes: ['uuid', 'fullname', 'peopleId'],
		});
		return res.status(200).json(users);
	} catch (error) {
		console.error('Function getUserWithStatus Error: ', error);
		return res.json([]);
	}
};

exports.getAllIsolationFacilities = async (req, res) => {
	try {
		const isoFacList = await IsolationFacility.findAll({
			raw: true,
			attributes: ['isolationFacilityId', 'isolationFacilityName'],
		});
		return res.status(200).json(isoFacList);
	} catch (error) {
		console.error('Function getAllIsolationFacilities Error: ', error);
		return res.status(200).json([]);
	}
};

exports.getProductPackages = async (req, res) => {
	let { page = 1, pageSize = 12, keyword = '' } = req.query;
	[page, pageSize] = [Number(page), Number(pageSize)];

	try {
		const packages = await getPackageList(page, pageSize, keyword);
		return res.status(200).json(packages);
	} catch (error) {
		console.error('Function getProductPackages Error: ', error);
		return res.status(400).json({});
	}
};
