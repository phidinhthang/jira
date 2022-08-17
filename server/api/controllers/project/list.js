module.exports = async function list(req, res) {
  const projects = await Project.find();

  return res.json(projects);
};
