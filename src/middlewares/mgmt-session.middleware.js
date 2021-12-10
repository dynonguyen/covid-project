exports.passSidebarStatus = (req, res, next) => {
	const { showSidebar = true } = req.cookies;
	res.locals.showSidebar = showSidebar === '0' ? false : true;
	next();
};
