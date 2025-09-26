const { registerAdmin, loginAdmin, getAdminById, updateAdminProfile, getAllUserService, getAllAdminsService, getUserByIdService } = require("../../services/admin/admin.auth.service");
const { verifyTokenService } = require("../../services/jwt.service");

exports.verifyAdminController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = verifyTokenService(token);
    if (!decoded || !decoded.isAdmin)
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Not admin" });

    const user = await getUserByIdService(decoded.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "Admin verified", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.adminRegister = async (req, res) => {
  try {
    const { admin, token } = await registerAdmin(req.body);

    res
      .cookie("admin_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "Admin registered successfully",
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { admin, token } = await loginAdmin(req.body);

    res
      .cookie("admin_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.adminLogout = async (req, res) => {
     res
       .clearCookie("admin_token", {
         httpOnly: true,
         secure: true,
         sameSite: "none",
         path: "/",
       })
       .status(200)
       .json({
         success: true,
         message: "Admin logged out successfully",
       });
};

exports.myAdmin = async (req, res) => {
  try {
    const admin = await getAdminById(req.admin.id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const updatedAdmin = await updateAdminProfile(req.admin.id, req.body);

    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await getAllUserService();

    res.status(200).json({
      success: true,
      message: "All User Get successfully",
      users:allUsers,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const allAdmins = await getAllAdminsService();

    res.status(200).json({
      success: true,
      message: "All User Get successfully",
      admins: allAdmins,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
