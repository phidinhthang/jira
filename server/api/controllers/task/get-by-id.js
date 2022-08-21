module.exports = async function getById(req, res) {
  const taskId = req.param("id");
  const task = await Task.findOne({ id: taskId })
    .populate("assignees")
    .populate("reporter")
    .populate("project");

  return res.json(task);
};
