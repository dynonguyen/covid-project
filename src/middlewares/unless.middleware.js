exports.unlessRoute = (excludePaths = [], middleware) => {
	return function (req, res, next) {
		const staticFileRegex = /^(?!.*(\.\w*))(.+?)$/i;
		const path = req.originalUrl;

		if (!staticFileRegex.test(path)) {
			return next();
		}

		for (let ep of excludePaths) {
			if (path.indexOf(ep) !== -1) {
				return next();
			}
		}

		return middleware(req, res, next);
	};
};
