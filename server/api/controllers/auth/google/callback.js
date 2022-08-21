const querystring = require("querystring");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

function getTokens({ code, clientId, clientSecret, redirectUri }) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  return fetch(`${url}?${querystring.stringify(values)}`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("get tokens data ", data);
      return data;
    });
}

module.exports = async function (req, res) {
  const code = req.query.code;
  console.log("code ", code);

  const data = await getTokens({
    code,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.BASE_URL}/auth/google/callback`,
  });

  console.log("data ", data);

  const { access_token, id_token } = data;

  const googleUser = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err.message);
    });

  console.log("google user ", googleUser);

  const googleId = googleUser.id;
  const email = googleUser.email;
  const displayName = googleUser.name;
  const avatar = googleUser.picture;
  const username = email.split("@")[0];

  const hasEmailExists = await Auth.count({
    email,
    accountType: { "!=": "google" },
  });

  if (hasEmailExists > 0) {
    return res.json({
      errors: {
        emailAlreadyExists: true,
      },
    });
  }

  const googleAuth = await Auth.findOne({
    googleId,
    accountType: "google",
  });

  let user;
  let auth;

  if (googleAuth) {
    auth = await Auth.updateOne({
      googleId,
    }).set({
      email,
      username,
    });
    console.log("updated in user auth");
    user = await User.updateOne({ id: googleAuth.user }).set({
      avatar,
      displayName,
    });
  } else {
    user = await User.create({
      displayName,
      avatar,
      isVerified: true,
    }).fetch();
    auth = await Auth.create({
      googleId,
      username,
      password: "google",
      user: user.id,
      email,
      accountType: "google",
    }).fetch();
  }
  console.log("created google account ", user, auth);

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const tokenPayload = uuidv4();
  await Token.create({ payload: tokenPayload, userId: user.id });

  const accessToken = jwt.sign({ payload: tokenPayload }, accessTokenSecret, {
    expiresIn: "7d",
  });

  res.redirect(
    `${process.env.WEB_URL}/auth/google/token?access_token=${accessToken}`
  );
};
