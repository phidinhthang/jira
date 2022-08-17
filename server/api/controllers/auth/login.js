const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async function login(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const userAuth = await Auth.findOne({ username });
  if (!userAuth) {
    return res.json({
      errors: {
        userDoesntExist: true,
      },
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, userAuth.password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      errors: {
        passwordIncorrect: true,
      },
    });
  }

  const user = await User.findOne({ id: userAuth.user });

  const accessToken = jwt.sign(
    { userId: user.id },
    sails.config.custom.accessTokenSecret,
    { expiresIn: "7d" }
  );

  res.json({
    user,
    accessToken,
  });
};