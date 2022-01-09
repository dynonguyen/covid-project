const { ACCOUNT_TYPES } = require('../../constants/index.constant');
const { MAX } = require('../../constants/index.constant');
const Accounts = require('../../models/account.model');
const Users = require('../../models/user.model')

exports.getUser = (req, res) => {
  const {username} = req.user;
  return res.redirect(`/user/${username}`)
}


exports.getUserList = async (req, res) => {
	try {
		const {username} = req.params;
    const account = await Accounts.findAll({
      where: {
        username
      },
    })
    const findUser = await Users.findOne({
      where: {
        accountId: account[0].accountId
      }
    })

    const yTa = await Accounts.findOne({
      where:{
        accountId: findUser.managerId
      }
    })
    return res.render('userInfo', {findUser, yTa})
	} catch (error) {
		console.error('Function getUserList Error: ', error);
		return res.render('404');
	}
};
