module.exports = async function list(req, res) {
  console.log("list userees");
  res.json(await Auth.find({ select: ["id", "username"] }));
};
