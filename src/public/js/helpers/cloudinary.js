const cloudinaryOptimize = (src = '', option = '') => {
	if (!option) {
		return src;
	}

	const isCloudinary = src.includes('res.cloudinary.com');
	if (!isCloudinary) {
		return src;
	}
	const separator = 'image/upload';
	return src.replace(separator, separator + '/' + option);
};

const getOriginSrcCloudinary = (optimizedSrc = '') => {
	const isCloudinary = optimizedSrc.includes('res.cloudinary.com');
	if (!isCloudinary) {
		return optimizedSrc;
	}

	return optimizedSrc.replace(/upload\/(.+\/)v/i, 'upload/v');
};
