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
    dueAt,
    estimatedAt,
  } = req.body || {};

  const updateFields = {
    name,
    description,
    type,
    status,
    index,
    assigneeIds,
    reporterId,
    priority,
    dueAt,
    estimatedAt,
  };

  const updatedTask = await Task.updateOne({ id: taskId }).set(updateFields);

  return res.json(updatedTask);
};
