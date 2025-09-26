const SSLCommerzPayment = require("sslcommerz-lts");
const { v4: uuidv4 } = require("uuid");
const DB = require("../configs/dbConfig");
const { sendConfirmationEmail } = require("../helpers/emailHelper");

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = false; // true for live, false for sandbox

exports.sslcommerzInit = async (req, res) => {
  const {
    eventId,
    ticketId,
    user,
    ticketQnt,
    userJson,
    attendeeJson = [],
    eventCreatorId,
  } = req.body;

  try {
    // Step 1: Get ticket data from DB
    const ticketData = await DB.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticketData) {
      return res.status(404).json({ message: "Ticket data not found." });
    }

    // Step 2: Calculate total ticket count and total price
    let totalTicketCount = 0;
    let totalPrice = 0;

    ticketQnt.forEach((item) => {
      const [qtyStr, type] = item.split("-");
      const qty = parseInt(qtyStr);
      totalTicketCount += qty;

      const matchedType = ticketData.ticketTypes.find(
        (t) => t.ticketName.toLowerCase() === type.toLowerCase()
      );

      if (matchedType) {
        totalPrice += qty * matchedType.price;
      }
    });

    // Step 3: Prepare transaction ID and ticketType string
    const transactionId = `txn_${uuidv4()}`;
    const ticketType = [...new Set(userJson.map((u) => u.ticketType))].join(
      ","
    );

    // Step 4: SSLCommerz payment data object
    const data = {
      total_amount: totalPrice,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.SERVER_URL}/api/payment/checkout/success?tran_id=${transactionId}`,
      fail_url: `${process.env.SERVER_URL}/api/payment/checkout/fail`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/checkout/cancel`,

      shipping_method: "Courier",
      product_name: ticketType,
      product_category: "Event",
      product_profile: "general",

      cus_name: userJson[0]?.name,
      cus_email: userJson[0]?.email,
      cus_add1: user?.address,
      cus_add2: user?.address,
      cus_city: user?.city,
      cus_state: user?.state,
      cus_postcode: user?.post,
      cus_country: user?.country,
      cus_phone: user?.phone,
      cus_fax: "",

      ship_name: userJson[0]?.name,
      ship_add1: user?.address,
      ship_add2: user?.address,
      ship_city: user?.city,
      ship_state: user?.state,
      ship_postcode: user?.post,
      ship_country: user?.country,

      value_a: eventId,
      value_b: ticketId,
      value_c: req?.user?.id,
      // value_d: event?.title
    };

    // Step 5: Store registration info
    await DB.registerEvent.create({
      data: {
        eventId,
        ticketId,
        userId: req?.user?.id,
        eventCreatorId,
        userJson,
        attendeeJson,
        ticketCount: totalTicketCount,
        ticketPrice: String(totalPrice),
        ticketType,
        order: false,
        paymentStatus: "Pending",
        transactionId,
      },
    });

    // Step 6: Initiate SSLCommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.status(200).json({ success: true, url: apiResponse.GatewayPageURL });
    } else {
      res.status(500).json({ message: "Payment initialization failed" });
    }
  } catch (error) {
    console.error("SSLCommerz Init Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.sslcommerzSuccess = async (req, res) => {
  const { tran_id } = req.query;

  try {
    const updated = await DB.registerEvent.updateMany({
      where: { transactionId: tran_id },
      data: {
        order: true,
        paymentStatus: "Paid",
      },
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const registerData = await DB.registerEvent.findFirst({
      where: { transactionId: tran_id },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
    console.log("registerData===>", registerData);

    if (registerData?.user?.email) {
      await sendConfirmationEmail(
        registerData?.user?.email,
        tran_id,
        registerData?.user?.name
      );
    }

    return res.redirect(`${process.env.CLIENT_URL}/payment/success/${tran_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.sslcommerzFail = async (req, res) => {
  return res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
};

exports.sslcommerzCancel = async (req, res) => {
  return res.redirect(`${process.env.CLIENT_URL}/payment/cancel`);
};

// ==================== IPN ====================

exports.sslcommerzIPN = async (req, res) => {
  const { tran_id } = req.body;

  if (!tran_id) {
    return res.status(400).send("Transaction or validation ID missing.");
  }

  const sslCommerzApiUrl = is_live
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

  try {
    // Find transaction in DB
    const transaction = await DB.registerEvent.findFirst({
      where: { transactionId: tran_id },
    });

    if (!transaction) {
      return res.status(404).send("Transaction not found in DB.");
    }

    // Validation API call (GET request with query params)
    const response = await fetch(
      `${sslCommerzApiUrl}?val_id=${tran_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch validation data");
    }

    const validationResult = await response.json();

    // Update DB based on validation status
    if (
      (validationResult.status === "VALID" ||
        validationResult.status === "VALIDATED") &&
      parseFloat(validationResult.amount) ===
        parseFloat(transaction.ticketPrice)
    ) {
      await DB.registerEvent.updateMany({
        where: { transactionId: tran_id },
        data: { order: true, paymentStatus: "Paid" },
      });
    } else {
      await DB.registerEvent.updateMany({
        where: { transactionId: tran_id },
        data: { order: false, paymentStatus: "Failed" },
      });
    }

    // ✅ Send full SSLCommerz validation response back
    res.status(200).json(validationResult);
  } catch (error) {
    console.error("Error processing IPN:", error);
    res.status(500).send("Error processing IPN.");
  }
};
