module.exports = async function getMe(req, res) {
  if (req.user) {
    return res.json(req.user);
  }

  return res.status(401).json({
    errors: {
      notAuthentication: true,
    },
  });
};
