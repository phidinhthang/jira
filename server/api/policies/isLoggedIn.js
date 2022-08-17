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

  const tokenPayload = jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET);
  const userId = tokenPayload.userId;

  if (!userId) {
    return res.status(401).json({
      errors: {
        notAuthentication: true,
      },
    });
  }

  const user = await User.findOne({ id: userId });

  req.user = user;

  return next();
};
