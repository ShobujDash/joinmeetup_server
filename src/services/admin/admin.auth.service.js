const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DB = require("../../configs/dbConfig");

const JWT_SECRET = process.env.JWT_SECRET ;

exports.registerAdmin = async ({ name, email, password }) => {
  const existingAdmin = await DB.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await DB.admin.create({
    data: {
      name,
      email,
      password: hashedPassword,
      access: true,
      transactionAccess: false,
      paymentAccess: false,
    },
  });

  const token = jwt.sign({ id: admin.id, isAdmin: true }, JWT_SECRET, {
    expiresIn: "30d",
  });

  return { admin, token };
};

exports.loginAdmin = async ({ email, password }) => {
  const admin = await DB.admin.findUnique({ where: { email } });
  if (!admin) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: admin.id, isAdmin: true }, JWT_SECRET, {
    expiresIn: "30d",
  });

  return { admin, token };
};

exports.getAdminById = async (id) => {
  return await DB.admin.findUnique({ where: { id } });
};

exports.updateAdminProfile = async (adminId, body) => {
  const { name, email, access, transactionAccess, paymentAccess } = body;

  return await DB.admin.update({
    where: { id: adminId },
    data: {
      name,
      email,
      access,
      transactionAccess,
      paymentAccess,
    },
  });
};

exports.getAllUserService = async (adminId, body) => {
  try {
    const users = await DB.user.findMany(); 
    return users;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};
exports.getAllAdminsService = async (adminId, body) => {
  try {
    const admins = await DB.admin.findMany();
    return admins;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

exports.getUserByIdService = async (id) => {
  return await DB.user.findUnique({ where: { id } });
};