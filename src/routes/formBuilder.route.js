const formBuilderRoute = require("express").Router();
const {
  createFormBuilderDataController,
  getFormBuilderDataController,
  updateFormBuilderDataController,
} = require("../controllers/formBuilder.controller");

formBuilderRoute.post("/create", createFormBuilderDataController);
formBuilderRoute.get("/:eventId/:ticketId", getFormBuilderDataController);
formBuilderRoute.put("/:eventId/:ticketId", updateFormBuilderDataController);


module.exports = formBuilderRoute;
