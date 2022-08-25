const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../../utils/send-email");

module.exports = async function register(req, res) {
  const { username, password, displayName, avatar, email } = req.body || {};

  const errors = {};
  if (!username) {
    errors["emptyUsername"] = true;
  }
  if (!password) {
    errors["emptyPassword"] = true;
  }
  if (!displayName) {
    errors["emptyDisplayName"] = true;
  }
  if (!email) {
    errors["emptyEmail"] = true;
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({
      errors,
    });
  }

  const hasUsernameExists = await Auth.count({ username });
  if (hasUsernameExists) {
    return res.status(400).json({
      errors: {
        usernameExists: true,
      },
    });
  }

  const hasEmailExists = await Auth.count({ email });
  if (hasEmailExists) {
    return res.status(400).json({
      errors: {
        emailExists: true,
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
    email,
    accountType: "local",
  }).fetch();

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const tokenPayload = uuidv4();
  await Token.create({ payload: tokenPayload, userId: user.id });

  const accessToken = jwt.sign({ payload: tokenPayload }, accessTokenSecret, {
    expiresIn: "7d",
  });

  res.json({
    user,
    accessToken,
  });

  const emailToken = uuidv4();
  await EmailToken.create({ token: emailToken, userId: user.id });

  await sendEmail(
    email,
    "Verify your email",
    `<a href="${process.env.BASE_URL}/auth/${emailToken}/verify">Click here to verify your email</a>`
  );
};
