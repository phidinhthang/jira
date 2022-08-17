module.exports = async function list(req, res) {
  return res.json(await Task.find());
};
