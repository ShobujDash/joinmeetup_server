const { createFormBuilderDataService, getFormBuilderDataService, updateFormBuilderDataService } = require("../services/formBuilder.service");


exports.createFormBuilderDataController = async (req, res) => {
  try {
    const { eventId, ticketId, formData } = req.body;

    if (!eventId || !ticketId || !formData) {
      return res.status(400).json({
        success: false,
        message: "eventId, ticketId, and formData are required.",
      });
    }

    const result = await createFormBuilderDataService({
      eventId,
      ticketId,
      formData,
    });

    return res.status(201).json({
      success: true,
      message: "FormBuilder data saved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error saving FormBuilder data:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.getFormBuilderDataController = async (req, res) => {
  try {
    const { eventId, ticketId } = req.params;

    if (!eventId || !ticketId) {
      return res.status(400).json({
        success: false,
        message: "eventId and ticketId are required in URL params.",
      });
    }

    const result = await getFormBuilderDataService({ eventId, ticketId });

   if (!result) {
     return res.status(200).json({
       success: false,
       message: "Form data not found for given event and ticket.",
       data: null,
     });
   }

    return res.status(200).json({
      success: true,
      message: "FormBuilder data retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving FormBuilder data:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


exports.updateFormBuilderDataController = async (req, res) => {
  try {
    const { eventId, ticketId } = req.params;
    const { formData } = req.body;

    if (!eventId || !ticketId || !formData) {
      return res.status(400).json({
        success: false,
        message: "eventId, ticketId, and formData are required.",
      });
    }

    const updated = await updateFormBuilderDataService({
      eventId,
      ticketId,
      formData,
    });

    return res.status(200).json({
      success: true,
      message: "FormBuilder data updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error updating FormBuilder data:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
