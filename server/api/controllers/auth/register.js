const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async function register(req, res) {
  const { username, password, displayName, avatar } = req.body || {};

  if (!displayName) {
    return res.json({
      errors: {
        emptyDisplayName: true,
      },
    });
  }

  const hasUsernameExists = await Auth.count({ username });
  if (hasUsernameExists) {
    return res.json({
      errors: {
        usernameExists: true,
      },
    });
  }

  const passwordSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, passwordSalt);
  const user = await User.create({
    displayName,
    avatar,
  }).fetch();
  const auth = await Auth.create({
    username,
    password: hashedPassword,
    user: user.id,
  }).fetch();

  const accessTokenSecret = sails.config.custom.accessTokenSecret;

  const accessToken = jwt.sign({ userId: user.id }, accessTokenSecret, {
    expiresIn: "7d",
  });

  res.json({
    user,
    accessToken,
  });
};
