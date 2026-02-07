const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = generateToken(user._id);

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict"
    })
    .status(201)
    .json({
      id: user._id,
      name: user.name,
      email: user.email
    });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user._id);

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict"
    })
    .json({
      id: user._id,
      name: user.name,
      email: user.email
    });
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};

// GET ME
exports.getMe = async (req, res) => {
  res.json(req.user);
};
