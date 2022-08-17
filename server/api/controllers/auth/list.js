module.exports = async function list(req, res) {
  console.log("list userees");
  console.log("process env ", process.env);
  res.json(await Auth.find({ select: ["id", "username"] }));
};
