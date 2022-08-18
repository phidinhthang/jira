module.exports = async function list(req, res) {
  const projectId = req.param("projectId");
  return res.json(
    await Task.find({ project: projectId }).populate("assignees")
  );
};
