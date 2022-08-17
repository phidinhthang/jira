module.exports = async function list(req, res) {
  const users = await User.find();

  return res.json(users);
};
