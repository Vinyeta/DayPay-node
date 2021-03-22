const userModel = require("../users/users.model");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const sendEmail = require("../../services/sendGrid");


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.login(email, password);
    console.log(user);
    if (user) {
      const token = jwt.sign(
        { _id: user._id, role: "admin" },
        process.env.TOKEN_SECRET
      );
      res.json({ token: token, user: user });
    }
  } catch (err) {
    res.status(400).json();
  }
};

const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userExists = await userModel.getByEmail(req.body.email);
    if (userExists) return res.status(400).json("User already exists");
    const newUser = req.body;
    const userCreated = userModel.create(newUser);
    sendEmail(newUser);
    return res.status(201).json(userCreated);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  login,
  signUp,
};
