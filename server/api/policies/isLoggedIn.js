const jwt = require("jsonwebtoken");

module.exports = async function isLoggedIn(req, res, next) {
  const bearerToken = req.headers?.authorization?.split(" ")?.[1];

  if (!bearerToken) {
    return res.status(401).json({
      errors: {
        notAuthentication: true,
      },
    });
  }

  try {
    const tokenPayload = jwt.verify(
      bearerToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const token = await Token.findOne({ payload: tokenPayload.payload });

    if (!token) {
      return res.status(401).json({
        errors: {
          notAuthentication: true,
        },
      });
    }

    const user = await User.findOne({ id: token.userId });

    req.user = user;

    return next();
  } catch (err) {
    console.log("authentication err ", err);
    return res.status(401).json({
      errors: {
        notAuthentication: true,
      },
    });
  }
};
