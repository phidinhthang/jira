module.exports = async function getById(req, res) {
  const projectId = req.param("id");

  const project = await Project.findOne({ id: projectId }).populate("tasks");

  return res.json(project);
};
