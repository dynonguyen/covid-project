const { parseSortStr } = require('../../helpers/index.helpers');

const { Sequelize } = require('sequelize');
const { MAX } = require('../../constants/index.constant');
const { Op } = require('../../configs/db.config');
const TreatMentHistory = require('../../models/treatment-history.model');
const IsolationFacilityId = require('../../models/isolation-facility.model');
const User = require('../../models/user.model');

exports.getTreatmentHistory = async (req, res) => {
  try{
    const treatmenthistoryid = await TreatMentHistory.findAll({
      where: {
        treatmentHistoryId
      },
    })
    const findUser = await User.findOne({
      where: {
        userId: treatmenthistoryid[0].userId
      }
    })
    const IsolationFacilityid = await IsolationFacilityId.findOne({
      where: {
        isolationFacilityId
      }
    })
    return res.render('treatmentHistory', {findUser, IsolationFacilityid});
  }catch(error){
    console.error('FunctionGetTreatmentHistory Error: ', error);
    return res.render('404');
  }
}
