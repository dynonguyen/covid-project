const treatmentHistoryRoute = require('express').Router();
const treatmentHistoryController = require('../../controllers/user/treatmenthistory.controller');

treatmentHistoryRoute.get("/treatmentHistory", treatmentHistoryController.getTreatmentHistory);
module.exports = treatmentHistoryRoute;
