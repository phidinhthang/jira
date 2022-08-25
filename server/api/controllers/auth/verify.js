module.exports = async function verifyEmail(req, res) {
  const emailToken = req.param("emailToken");
  if (!emailToken) {
    return res.redirect(`${process.env.WEB_URL}/auth/verify/error`);
  }

  const userId = (await EmailToken.findOne({ token: emailToken }))?.userId;

  if (!userId) {
    return res.redirect(`${process.env.WEB_URL}/auth/verify/error`);
  }

  const updatedUser = await User.updateOne(
    { id: userId },
    { isVerified: true }
  );

  if (!updatedUser) {
    return res.redirect(`${process.env.WEB_URL}/auth/verify/error`);
  }

  return res.redirect(`${process.env.WEB_URL}/auth/verify/success`);
};
