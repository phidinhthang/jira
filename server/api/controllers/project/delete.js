module.exports = async function (req, res) {
  const projectId = req.param("id");

  const deletedProject = await Project.destroyOne({ id: projectId });

  return res.json(deletedProject);
};
