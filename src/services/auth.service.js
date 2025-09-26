const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DB = require("../configs/dbConfig");
const { sendOTPEmail } = require("../helpers/sendOTP");

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async ({ name, email, password }) => {
  const existingUser = await DB.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await DB.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      otp: otpCode,
    },
  });

  await sendOTPEmail(user?.email, otpCode, user?.name);

  // const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, {
  //   expiresIn: "30d",
  // });

  return { user };
};

exports.loginUser = async ({ email, password }) => {
  const user = await DB.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials email");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials pass");

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  await DB.user.update({
    where: { id: user.id },
    data: { otp: otpCode },
  });

  await sendOTPEmail(user.email, otpCode);

  // const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, {
  //   expiresIn: "30d",
  // });

  return { user };
};

// 🔹 Verify OTP
exports.verifyOtpService = async ({ email, otp }) => {
  console.log("email ======================================",email)
  const user = await DB.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  if (user.otp !== otp) throw new Error("Invalid OTP");

  // OTP Reset
  await DB.user.update({
    where: { id: user.id },
    data: { otp: "0" },
  });

  const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, {
    expiresIn: "30d",
  });

  return { user, token };
};

exports.googleService = async ({ email, name, googlePhotoUrl }) => {
  let user = await DB.user.findUnique({ where: { email } });

  if (!user) {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    user = await DB.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: googlePhotoUrl || null,
      },
    });
  }

  // টোকেন বানাও
  const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, {
    expiresIn: "30d",
  });

  return { user, token };
};

exports.getUserById = async (id) => {
  return await DB.user.findUnique({ where: { id } });
};

exports.updateUserProfile = async (userId, body, file) => {
  const {
    name,
    email,
    phone,
    dob,
    gender,
    profession,
    website,
    facebook,
    address,
    bio,
  } = body;

  let data = {
    name,
    email,
    phone,
    dob,
    gender,
    profession,
    website,
    facebook,
    address,
    bio,
  };

  if (file) {
    data.image = `/uploads/${file.filename}`; // Store relative path
  }

  return await DB.user.update({
    where: { id: userId },
    data,
  });
};

exports.createUsersService = async (users) => {
  const created = [];

  for (const user of users) {
    const existing = await DB.user.findUnique({
      where: { email: user.email },
    });

    if (!existing) {
      const newUser = await DB.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: "", // optional, since no password required for event
        },
      });
      created.push(newUser);
    }
  }

  return created;
};
