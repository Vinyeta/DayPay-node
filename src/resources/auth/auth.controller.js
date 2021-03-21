const userModel = require("../users/users.model");
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail')
const { validationResult } = require('express-validator');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)





// const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await userModel.getByEmail(email);
//   if (user.password === password) {
//     const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET);
//     res.json(token);
//   } else {
//     res.status(401).send("Username or password incorrect");
//   }
// };

const login2 = async (req, res) => {
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
  try{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userExists = await userModel.getByEmail(req.body.email)
  if (userExists) return res.status(400).json('User already exists');
  console.log('test1')
  const newUser = req.body;
  const userCreated = userModel.create(newUser);
  console.log('test2')
  const msg = {
    to: newUser.email, // Change to your recipient
    from: "avinetam@gmail.com", // Change to your verified sender
    subject: 'Welcome to DayPay',
    text: `Welcome to DayPay ${newUser.name} ${newUser.surname}, start sending money to your acquaintance instantly!`,
    html: `<strong>Welcome to DayPay ${newUser.name} ${newUser.surname}, start sending money to your acquaintance instantly!</strong>`,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    });
  return res.status(201).json(userCreated);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  // login,
  login2,
  signUp,
};