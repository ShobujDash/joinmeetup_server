const { createRegisterEvent, getAllRegisterEvents, getRegisterEventById, deleteRegisterEventById, checkIfUserRegisteredController, getMyRegisteredEventsController, participants, participantsByEventId, getTransDetails } = require("../controllers/registerEvent.controller");
const adminAuthMiddleware = require("../middlewares/admin.auth.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const registerEventRoute = require("express").Router();



registerEventRoute.post("/create", authMiddleware, createRegisterEvent);
registerEventRoute.get("/all", getAllRegisterEvents);
registerEventRoute.get("/get/:id", getRegisterEventById);
registerEventRoute.get("/participants", authMiddleware, participants);
registerEventRoute.get(
  "/participantsByEventId/:id",
  participantsByEventId
);
registerEventRoute.get("/trans_details/:transId", getTransDetails);

registerEventRoute.get(
  "/isRegisteredEvent/:eventId",
  authMiddleware,
  checkIfUserRegisteredController
);

registerEventRoute.get(
  "/myRegisteredEvents",
  authMiddleware,
  getMyRegisteredEventsController
);

registerEventRoute.delete(
  "/delete/:id",
  authMiddleware,
  deleteRegisterEventById
);

module.exports = registerEventRoute;
