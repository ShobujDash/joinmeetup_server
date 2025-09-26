const eventRouter = require("express").Router();
const {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  getEventsByUserIdController,
  getEventsByCreatorIdController,
  deleteEventController,
  getTotalEveentNumberController,
  updateEventController,
  getEventsByCategoryController,
  publishEventController,
} = require("../controllers/event.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/uploadFileMiddleware");


eventRouter.post(
  "/create",
  authMiddleware,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "speakerImage", maxCount: 10 },
  ]),
  createEventController
);

// Update Event
eventRouter.put(
  "/update/:id",
  authMiddleware,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "speakerImage", maxCount: 10 },
  ]),
  updateEventController
);



eventRouter.put("/publish/:id", authMiddleware, publishEventController);


eventRouter.get("/all", getAllEventsController);

eventRouter.get("/category/:categoryName", getEventsByCategoryController);

eventRouter.get("/userId", authMiddleware, getEventsByUserIdController);

eventRouter.get("/single-event/:id", getEventByIdController);

eventRouter.get("/totalEventNumber", authMiddleware, getTotalEveentNumberController);

eventRouter.delete("/:id", authMiddleware, deleteEventController);

eventRouter.get("/:userId", getEventsByCreatorIdController);

module.exports = eventRouter;
