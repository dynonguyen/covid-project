const cloudinary = require('../configs/cloudinary.config');
const {
	CLOUDINARY_FOLDER,
	CLOUDINARY_UPLOAD_PRESET,
} = require('../constants/index.constant');
const { Readable } = require('stream');
const ProductImage = require('../models/product-image.model');

const bufferToStream = (buffer) => {
	const readable = new Readable({
		read() {
			this.push(buffer);
			this.push(null);
		},
	});
	return readable;
};

const cloudinaryUploadStream = (file, folder = CLOUDINARY_FOLDER, fileName) => {
	return new Promise((resolve, reject) => {
		if (!file) return reject('File is required !');

		const stream = cloudinary.uploader.upload_stream(
			{
				folder,
				upload_preset: CLOUDINARY_UPLOAD_PRESET,
				public_id: fileName,
			},
			(error, result) => {
				if (error) {
					reject('');
				} else {
					resolve(result.secure_url);
				}
			}
		);

		bufferToStream(file.buffer).pipe(stream);
	});
};

const getCloudinaryPublicId = (url = '') => {
	const isCloudinary = url.includes('res.cloudinary.com');
	if (!isCloudinary) {
		return '';
	}

	const index = url.indexOf(`${CLOUDINARY_FOLDER}/`);
	if (index === -1) return '';

	const publicIdSplit = url.substring(index).split('.');
	publicIdSplit.pop();
	return publicIdSplit.join('');
};

exports.uploadProductPhoto = async (
	file,
	fileName,
	productId,
	isThumbnail = false
) => {
	const uploadFolder = `${CLOUDINARY_FOLDER}/products/${[productId]}`;

	try {
		const photoUrl = await cloudinaryUploadStream(file, uploadFolder, fileName);
		const productImg = await ProductImage.create({
			productId,
			src: photoUrl,
			isThumbnail,
		});
		if (productImg) return true;

		return false;
	} catch (error) {
		console.log('uploadProductPhoto ERROR: ', error);
		return false;
	}
};

exports.deleteProductPhoto = async (productId) => {
	const path = `${CLOUDINARY_FOLDER}/products/${productId}/`;
	cloudinary.api.delete_resources_by_prefix(path, function (err, result) {
		if (err) console.log('deleteProductPhotoError: ', err);
		cloudinary.api.delete_folder(path);
	});
};

exports.cloudinaryOptimize = (url = '', option = '') => {
	if (!option) {
		return url;
	}

	const isCloudinary = url.includes('res.cloudinary.com');
	if (!isCloudinary) {
		return url;
	}
	const separator = 'image/upload';
	return url.replace(separator, separator + '/' + option);
};

exports.cloudinaryDeletePhoto = (url = '') => {
	return new Promise((resolve, reject) => {
		const publicId = getCloudinaryPublicId(url);
		if (!publicId) {
			resolve(false);
		}
		cloudinary.uploader.destroy(publicId, (err, result) => {
			if (err) return resolve(false);
			resolve(true);
		});
	});
};
