module.exports = async function list(req, res) {
  res.json(await Auth.find({ select: ["id", "username"] }));
};
