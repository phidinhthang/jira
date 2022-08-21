const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports = async function login(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const userAuth = await Auth.findOne({ username, accountType: "local" });
  console.log("access token secret ", process.env.ACCESS_TOKEN_SECRET);
  if (!userAuth) {
    return res.status(401).json({
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
  const tokenPayload = uuidv4();
  console.log(" token payload in login ", tokenPayload);
  await Token.create({ payload: tokenPayload, userId: user.id });

  const accessToken = jwt.sign(
    { payload: tokenPayload },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.json({
    user,
    accessToken,
  });
};
