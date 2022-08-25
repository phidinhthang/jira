module.exports = async function update(req, res) {
  const taskId = req.param("id");
  const {
    name,
    description,
    type,
    status,
    index,
    assigneeIds,
    reporterId,
    priority,
    remainingTime,
    estimatedTime,
    spentTime,
  } = req.body || {};

  const updateFields = {
    name,
    description,
    type,
    status,
    index,
    reporter: reporterId,
    priority,
    remainingTime,
    estimatedTime,
    spentTime,
  };

  if (Array.isArray(assigneeIds)) {
    await Task.replaceCollection(taskId, "assignees", assigneeIds);
  }
  await Task.updateOne({ id: taskId }).set(updateFields);
  const updatedTask = await Task.findOne({ id: taskId })
    .populate("assignees")
    .populate("reporter")
    .populate("project");

  return res.json(updatedTask);
};
