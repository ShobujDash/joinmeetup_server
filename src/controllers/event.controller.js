const DB = require("../configs/dbConfig");
const {
  createEvent,
  getAllEvents,
  getEventsByUser,
  getEventById,
  deleteEvent,
  getTotalEventCountByUser,
  getEventsByCategoryService,
  publishEventService,
  updateEventService,
} = require("../services/event.service");

exports.createEventController = async (req, res) => {
  try {
    const userId = req.user.id;

    // banner image
    const banner = req.files["banner"]?.[0]?.filename || null;

    // multiple speaker images
    const speakerImages = req.files["speakerImage"]
      ? req.files["speakerImage"].map((f) => f.filename)
      : [];

    // speakers (parse JSON)
    let finalSpeakers = [];
    if (req.body.speakers) {
      try {
        const speakers = JSON.parse(req.body.speakers);
        finalSpeakers = speakers.map((sp, idx) => ({
          ...sp,
          image: speakerImages[idx] || null,
        }));
      } catch (err) {
        console.error("Invalid speakers JSON:", err);
      }
    }

    const eventData = {
      eName: req.body.eName,
      hostName: req.body.hostName,
      eStDateAndTime: req.body.eStDateAndTime,
      eEndDateAndTime: req.body.eEndDateAndTime,
      category: req.body.category,
      eAddress: req.body.eAddress,
      eDes: req.body.eDes,
      isOnline: req.body.isOnline,
      fbUrl: req.body.fbUrl,
      refindPolicy: req.body.refindPolicy,
      tremsAndCon: req.body.tremsAndCon,
      zoomLink: req.body.zoomLink,
      banner,
      speakers: finalSpeakers,
      userId,
      isPublish: false,
    };

    const event = await createEvent(eventData);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    console.error("createEventController Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// exports.updateEventController = async (req, res) => {
//   try {
//     const eventId = req.params.id;

//     const eventFromDB = await DB.events.findUnique({
//       where: { id: eventId },
//     });

//     if (!eventFromDB) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Event not found" });
//     }

//     // 🔹 Banner image
//     const banner = req.files["banner"]?.[0]?.filename || eventFromDB.banner;

//     // 🔹 Multiple speaker images
//     const speakerImages = req.files["speakerImage"]
//       ? req.files["speakerImage"].map((f) => f.filename)
//       : [];
//     let speakerIndexes = req.body.speakerIndex || [];

//     console.log("speaker images==>", speakerImages);
//     console.log("speaker index==>", speakerIndexes);

//     // 🔹 Speakers
//     let finalSpeakers = [];
//     if (req.body.speakers) {
//       try {
//         const speakers = JSON.parse(req.body.speakers);
//         finalSpeakers = speakers.map((sp, idx) => {
//           // Existing image thakle use korbe, new image thakle replace korbe
//           const existingImage = eventFromDB?.speakers?.[idx]?.image || null;
//           return {
//             ...sp,
//             image: speakerImages[idx] || existingImage,
//           };
//         });
//       } catch (err) {
//         console.error("Invalid speakers JSON:", err);
//       }
//     }

//     // 🔹 Prepare event data
//     const eventData = {
//       eName: req.body.eName,
//       hostName: req.body.hostName,
//       eStDateAndTime: req.body.eStDateAndTime,
//       eEndDateAndTime: req.body.eEndDateAndTime,
//       category: req.body.category,
//       eAddress: req.body.eAddress,
//       eDes: req.body.eDes,
//       isOnline: req.body.isOnline === true || req.body.isOnline === "true",
//       fbUrl: req.body.fbUrl,
//       refindPolicy: req.body.refindPolicy,
//       tremsAndCon:
//         req.body.tremsAndCon === true || req.body.tremsAndCon === "true",
//       zoomLink: req.body.zoomLink,
//       banner: banner,
//       speakers: finalSpeakers.length ? finalSpeakers : undefined,
//     };

//     // 🔹 Update event
//     const updatedEvent = await updateEventService(eventId, eventData);

//     res.status(200).json({
//       success: true,
//       message: "Event updated successfully",
//       event: updatedEvent,
//     });
//   } catch (err) {
//     console.error("updateEventController Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.updateEventController = async (req, res) => {
  try {
    const eventId = req.params.id;

    const eventFromDB = await DB.events.findUnique({
      where: { id: eventId },
    });

    if (!eventFromDB) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // 🔹 Banner image
    const banner = req.files["banner"]?.[0]?.filename || eventFromDB.banner;

    // 🔹 Multiple speaker images
    const speakerImages = req.files["speakerImage"]
      ? req.files["speakerImage"].map((f) => f.filename)
      : [];

    let speakerIndexes = req.body.speakerIndex || [];
    if (!Array.isArray(speakerIndexes)) speakerIndexes = [speakerIndexes]; // single value handle

    console.log("speaker images==>", speakerImages);
    console.log("speaker index==>", speakerIndexes);

    // 🔹 Speakers
    let finalSpeakers = [];
    if (req.body.speakers) {
      try {
        const speakers = JSON.parse(req.body.speakers);

        finalSpeakers = speakers.map((sp, idx) => {
          // check if a new image was uploaded for this speaker
          const imageIndex = speakerIndexes.findIndex((i) => Number(i) === idx);

          const newImage = imageIndex !== -1 ? speakerImages[imageIndex] : null;

          return {
            ...sp,
            image: newImage || eventFromDB?.speakers?.[idx]?.image || null,
          };
        });
      } catch (err) {
        console.error("Invalid speakers JSON:", err);
      }
    }

    // 🔹 Prepare event data
    const eventData = {
      eName: req.body.eName,
      hostName: req.body.hostName,
      eStDateAndTime: req.body.eStDateAndTime,
      eEndDateAndTime: req.body.eEndDateAndTime,
      category: req.body.category,
      eAddress: req.body.eAddress,
      eDes: req.body.eDes,
      isOnline: req.body.isOnline === true || req.body.isOnline === "true",
      fbUrl: req.body.fbUrl,
      refindPolicy: req.body.refindPolicy,
      tremsAndCon:
        req.body.tremsAndCon === true || req.body.tremsAndCon === "true",
      zoomLink: req.body.zoomLink,
      banner: banner,
      speakers: finalSpeakers.length ? finalSpeakers : undefined,
    };

    // 🔹 Update event
    const updatedEvent = await updateEventService(eventId, eventData);

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    console.error("updateEventController Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.publishEventController = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublish } = req.body;

    if (typeof isPublish !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isPublish must be true or false",
      });
    }

    const updatedEvent = await publishEventService(id, isPublish);

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Event ${isPublish ? "published" : "unpublished"} successfully`,
      data: updatedEvent,
    });
  } catch (error) {
    console.error("publishEventController Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event publish status",
      error: error.message,
    });
  }
};

exports.getAllEventsController = async (req, res) => {
  try {
    const number = parseInt(req.query.number);
    const events = await getAllEvents(number);

    res
      .status(200)
      .json({ success: true, message: "Events fetched successfully", events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEventsByCategoryController = async function (req, res) {
  try {
    const categoryName = req.params.categoryName;

    const events = await getEventsByCategoryService(categoryName);

    if (!events || events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No events found for category: " + categoryName,
      });
    }

    res.status(200).json({
      success: true,
      message: "Events fetched for category: " + categoryName,
      events: events,
    });
  } catch (err) {
    console.error("getEventsByCategoryController Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching events by category",
    });
  }
};

exports.getEventsByUserIdController = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await getEventsByUser(userId);

    if (!events || events.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User events not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User events fetched", events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEventsByCreatorIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const events = await getEventsByUser(userId);

    if (!events || events.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User events not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User events fetched", events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEventByIdController = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await getEventById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Event fetched successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getTotalEveentNumberController = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalEvents = await getTotalEventCountByUser(userId);

    res.status(200).json({
      success: true,
      message: "Total event count fetched successfully",
      totalEvents,
    });
  } catch (error) {
    console.error("getTotalEveentNumberController Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching total event count",
    });
  }
};

exports.deleteEventController = async (req, res) => {
  try {
    const eventId = req.params.id;

    const deleted = await deleteEvent(eventId);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
