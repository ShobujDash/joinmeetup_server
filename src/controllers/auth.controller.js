const {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  createUsersService,
  googleService,
  verifyOtpService,
} = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const { user } = await registerUser(req.body);

    // res
    //   .cookie("token", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    //   })
    //   .status(201)
    //   .json({
    //     success: true,
    //     message: "User registered successfully",
    //     user: { id: user.id, name: user.name, email: user.email },
    //   });

    res.status(201).json({
      success: true,
      message: "User registered. Please check your email for OTP.",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user } = await loginUser(req.body);

    // res
    //   .cookie("token", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    //   })
    //   .status(200)
    //   .json({
    //     success: true,
    //     message: "Login successful",
    //     user: { id: user.id, name: user.name, email: user.email },
    //   });

    res.status(200).json({
      success: true,
      message: "Login initiated. Please check your email for OTP.",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { user, token } = await verifyOtpService(req.body);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".vercel.app", 
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "OTP verified. Login successful.",
        user: { id: user.id, name: user.name, email: user.email },
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  if (!name || !email) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const { user, token } = await googleService({
      email,
      name,
      googlePhotoUrl,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".vercel.app", 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
  } catch (error) {
    next(error);
  }
};

exports.myAuth = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
       domain: ".vercel.app", 
      path: "/", // optional, but safest
    })
    .json({ success: true, message: "Logged out successfully" });
};

exports.createUsersController = async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Users array is required" });
    }

    const createdUsers = await createUsersService(users);

    res.status(201).json({
      success: true,
      message: "Users created successfully",
      data: createdUsers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateUserProfile(
      req.user.id,
      req.body,
      req.file
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
