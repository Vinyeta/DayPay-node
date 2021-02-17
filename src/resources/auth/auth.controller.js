const userModel = require("../users/users.model");
const jwt = require("jsonwebtoken");


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
        { email: email, role: "admin" },
        process.env.TOKEN_SECRET
      );
      res.json({ token: token, user: user });
    }
  } catch (err) {
    res.status(400).json();
  }
};

const signUp = (req, res) => {
  const newUser = req.body;
  const userCreated = userModel.create(newUser);
  return res.status(201).json(userCreated);
};

module.exports = {
  // login,
  login2,
  signUp,
};
