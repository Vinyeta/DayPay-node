const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
//ahun tenemos que importar el userModel

const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await userModel.getByEmail(email);
    if (user.password === password)
    {
      const token = jwt.sign({email: email}, process.env.TOKEN_SECRET);
      res.json(token);
    } 
    else {
      res.status(401).send("Username or password incorrect");
    }
};

module.exports = {
  login
};